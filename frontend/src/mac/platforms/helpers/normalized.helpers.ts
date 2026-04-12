import { normalizeXYToUtm } from "../../../global/helpers/normalize-location";
import type {
  PlatformInterface,
  UpdatePlatformInterface,
} from "../types/platforms.types";

export const normalizedEditFormPlatform = (platform: PlatformInterface) => {
  const { id: _id, type: _type, x, y, roip: _roip, ...data } = platform;

  const normalizePlatform: UpdatePlatformInterface = {
    ...data,
    landmark: !x || !y ? "אין נתונים" : normalizeXYToUtm([x, y]),
  };
  return normalizePlatform;
};
