type PlatformType =
  | "מרכז מחשוב"
  | 'חמ"ל משתמשים'
  | "אתר תקשוב"
  | "קרון מתרחב"
  | 'תק"ש רדיו'
  | 'תק"ש שרתים';

type StatusNetworkType = "תקין" | "תקין חלקית" | "לא תקין" | "אין נתונים";

export interface PlatformInterface {
  id: string;
  name: string;
  type: PlatformType;
  unit: string | "אין נתונים";
  location: string | "אין נתונים";
  x: number | null;
  y: number | null;
  connected_to: string | "אין נתונים";
  roip: StatusNetworkType;
  elad: StatusNetworkType;
  cellular: StatusNetworkType;
  satellite_communication: StatusNetworkType;
  tactical_environment: StatusNetworkType;
  intelligence_environment: StatusNetworkType;
  black_stationary: StatusNetworkType;
  white_noise: StatusNetworkType;
  red_stationary: StatusNetworkType;
  tactical_stationary: StatusNetworkType;
  cloud: StatusNetworkType;
}

export interface UpdatePlatformInterface extends Omit<
  PlatformInterface,
  "id" | "type" | "x" | "y" | "roip"
> {
  landmark: string;
}
