import { Injectable } from "@angular/core";
import { MonthlyRecord } from "../_models/MonthlyRecord";

@Injectable({ providedIn: 'root' })
export class MonthlyDraftService {
  private draft: {
    records: MonthlyRecord[];
    selectedMonth: string;
    selectedYear: string;
  } | null = null;

  saveDraft(data: {
    records: MonthlyRecord[];
    selectedMonth: string;
    selectedYear: string;
  }) {
    this.draft = structuredClone(data); // חשוב! העתק עמוק
  }

  getDraft() {
    return this.draft;
  }

  clearDraft() {
    this.draft = null;
  }
}
