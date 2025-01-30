import { Injectable } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';

@Injectable()
export class CustomPaginatorIntl extends MatPaginatorIntl {
  override itemsPerPageLabel = 'פריטים בעמוד:';
  override nextPageLabel = 'עמוד הבא';
  override previousPageLabel = 'עמוד קודם';
  override firstPageLabel = 'עמוד ראשון';
  override lastPageLabel = 'עמוד אחרון';

  override getRangeLabel = (page: number, pageSize: number, length: number): string => {
    if (length === 0) {
      return 'אין נתונים להצגה';
    }
    const start = page * pageSize + 1;
    const end = Math.min((page + 1) * pageSize, length);
    return `${start} - ${end} מתוך ${length}`;
  };
}
