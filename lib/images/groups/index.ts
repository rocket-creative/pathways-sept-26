import type { ImageGroup } from "@/lib/images/types";
import { CONCERNS_WELLNESS } from "@/lib/images/groups/concerns-wellness";
import { HOME_ABOUT } from "@/lib/images/groups/home-about";
import { PRACTICE } from "@/lib/images/groups/practice";
import { THERAPY } from "@/lib/images/groups/therapy";

/**
 * One file per page family. Add a group here once, then curate inside it.
 * Asset ids and page urls must be unique across all groups; lib/images/index.ts
 * throws at build time if they are not.
 */
export const GROUPS: ImageGroup[] = [HOME_ABOUT, THERAPY, CONCERNS_WELLNESS, PRACTICE];
