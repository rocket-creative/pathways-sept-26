#!/usr/bin/env python3
"""Quality gate for pages/**.md. Run from the build root: python3 tools/check-pages.py"""
import csv, glob, json, os, re, sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
# The build package lives under content/ in this repo; keep working standalone.
ROOT = os.path.join(REPO, "content") if os.path.isdir(os.path.join(REPO, "content", "pages")) else REPO
BANNED = ["seamless","robust","leverage","streamline","happy to","through line","operationally",
          "delve","tapestry","unlock","unleash","empower","foster","navigate","elevate","harness",
          "transformative","comprehensive","cutting edge","cutting-edge","it's important to note",
          "in today's","look no further","holistic","simplepractice","ivypay","vagaro","med spa","medspa",
          "aesthetician","pathways to beauty","sister site","sister practice","near me"]
RANGES = {"service":(850,1400),"concern":(850,1200),"insurance":(450,750),"location":(550,850),
          "hub":(250,1600),"trust":(150,2500),"resource":(150,3000),"provider":(250,800)}
CRED = re.compile(r"\b(LCSW-R|MHC-LP|MFT-LP|RN-BC|LMHC-D|PMHNP-BC|E-?Stim|COVID-19|X-ray|Cross-?Blue)\b")

def load_urlmap():
    urls=set()
    with open(os.path.join(ROOT,"data","url-map.csv")) as f:
        for r in csv.DictReader(f): urls.add(r["url"])
    with open(os.path.join(ROOT,"data","providers-sheet.csv")) as f:
        for r in csv.DictReader(f):
            if r.get("role")!="Admin": urls.add("/providers/"+r["slug"])
    with open(os.path.join(ROOT,"data","locations-sheet.csv")) as f:
        for r in csv.DictReader(f): urls.add("/locations/"+r["slug"])
    return urls

def parse(path):
    t=open(path,encoding="utf-8").read()
    m=re.match(r"^---\n(.*?)\n---\n(.*)$",t,re.S)
    if not m: return None,None,None,t
    fm={}
    for line in m.group(1).split("\n"):
        if ":" in line and not line.startswith(" "):
            k,v=line.split(":",1); v=v.strip()
            if v.startswith('"') and v.endswith('"'): v=v[1:-1]
            fm[k.strip()]=v
    body=m.group(2)
    jm=re.search(r"```json\n(.*?)\n```",body,re.S)
    js=jm.group(1) if jm else None
    copy=body[:jm.start()] if jm else body
    return fm,copy,js,t

def main():
    urls=load_urlmap(); errs=0; titles={}; metas={}; h1s={}
    files=sorted(glob.glob(os.path.join(ROOT,"pages","**","*.md"),recursive=True))
    for p in files:
        rel=os.path.relpath(p,ROOT)
        if os.path.basename(p).startswith("_"): continue
        fm,copy,js,raw=parse(p)
        problems=[]
        if fm is None: print(f"{rel}: no front matter"); errs+=1; continue
        t=fm.get("title",""); m=fm.get("meta",""); h1=fm.get("h1","")
        if not 50<=len(t)<=60: problems.append(f"title {len(t)} chars")
        if not 140<=len(m)<=155: problems.append(f"meta {len(m)} chars")
        if len(h1)>70 or not h1: problems.append(f"h1 {len(h1)} chars")
        for d,k in ((titles,t),(metas,m),(h1s,h1)):
            if k in d: problems.append(f"duplicate {'title' if d is titles else 'meta' if d is metas else 'h1'} with {d[k]}")
            d[k]=rel
        if "!" in m: problems.append("meta has exclamation")
        # copy checks
        text=copy
        text_nolinks=re.sub(r"\(https?://[^\s)]+\)","",text)
        text_nolinks=re.sub(r"\[QUIZ\].*?\[/QUIZ\]","",text_nolinks,flags=re.S)
        text_nolinks=re.sub(r"\]\(/[^)]*\)","]",text_nolinks)
        text_nolinks=re.sub(r"->\s*/\S+","",text_nolinks)
        text_nolinks=re.sub(r"\[(PROVIDER CARDS|LOCATION CARDS|FORM|IMAGE|CTA)[^\]]*\]","",text_nolinks)
        text_nolinks=re.sub(r"\[NEEDS:[^\]]*\]","",text_nolinks)
        text_nolinks=CRED.sub("",text_nolinks)
        text_nolinks=re.sub(r"^\*\*Written by\*\*.*$","",text_nolinks,flags=re.M)
        if re.search(r"[—–]",text_nolinks): problems.append("em/en dash in copy")
        hy=[w for w in re.findall(r"\b\w+-\w+\b",text_nolinks) if not re.match(r"^\d",w)]
        hy=[w for w in hy if not re.match(r"^\d+-\d+$",w)]
        if hy: problems.append("hyphens: "+", ".join(sorted(set(hy))[:8]))
        low=text_nolinks.lower()
        bw=[b for b in BANNED if re.search(r"\b"+re.escape(b)+r"\b",low)]
        if bw: problems.append("banned: "+", ".join(bw))
        words=len(re.findall(r"[A-Za-z']+",re.sub(r"\[[A-Z ]+:[^\]]*\]","",text)))
        lo,hi=RANGES.get(fm.get("page_type","hub"),(0,99999))
        if not lo<=words<=hi: problems.append(f"words {words} (want {lo}-{hi})")
        if "**Written by**" not in text: problems.append("no author block")
        if text.count("\n# ")!=1: problems.append(f"h1 count {text.count(chr(10)+'# ')}")
        for link in re.findall(r"\]\((/[^)\s#]*)",text):
            if link not in urls: problems.append(f"bad link {link}")
        for link in re.findall(r"->\s*(/[^\s]*)",text):
            if link.split('#')[0] not in urls: problems.append(f"bad CTA link {link}")
        if js is None: problems.append("no json block")
        else:
            try: json.loads(js)
            except Exception as e: problems.append(f"json error {e}")
            if '"FAQPage"' in js or '"HowTo"' in js or "AggregateRating" in js: problems.append("forbidden schema type")
        if problems:
            errs+=1; print(f"{rel}:\n  - "+"\n  - ".join(problems))
    print(f"\n{len(files)} files checked, {errs} with problems")
    sys.exit(1 if errs else 0)

if __name__=="__main__": main()
