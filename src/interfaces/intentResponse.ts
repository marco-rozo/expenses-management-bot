import { ReportPeriod } from "../enums/reportPeriod";
import { UserIntent } from "../enums/userIntent";

export interface IntentResponse {
  intent: UserIntent;
  period?: ReportPeriod;
  message?: string;
}