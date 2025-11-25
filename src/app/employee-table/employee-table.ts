import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-employee-table',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './employee-table.html'
})
export class EmployeeTable implements OnInit, OnDestroy {
  Math = Math; // <-- Fix
  document=document;
  // --- Modal state & edit buffers ---
  showEditModal = false;
  modalAnimation = false; // controls scale/fade class
  editingEmployee: Employee | null = null;
  tempEmployee: Employee | null = null;

  // --- Sorting (multi-column) ---
  sortState: { column: keyof Employee; direction: 'asc' | 'desc' }[] = [];

  // --- Table data ---
  employees: Employee[] = [
    { name: "Prescott Bartlett", position: "Technical Author", office: "London", age: 27, startDate: "2011-05-07", salary: "$145,000" },
    { name: "Gavin Cortez", position: "Team Leader", office: "San Francisco", age: 22, startDate: "2008-10-26", salary: "$235,500" },
    { name: "Lael Greer", position: "Systems Administrator", office: "London", age: 21, startDate: "2009-02-27", salary: "$103,500" },
    { name: "Gloria Little", position: "Systems Administrator", office: "New York", age: 59, startDate: "2009-04-10", salary: "$237,500" },
    { name: "Tiger Nixon", position: "System Architect", office: "Edinburgh", age: 61, startDate: "2011-04-25", salary: "$320,800" },
    { name: "Tiger Nixon", position: "System Architect", office: "Edinburgh", age: 61, startDate: "2011-04-25", salary: "$320,800" },
    { name: "Prescott Bartlett", position: "Technical Author", office: "London", age: 27, startDate: "2011-05-07", salary: "$145,000" },
    { name: "Gavin Cortez", position: "Team Leader", office: "San Francisco", age: 22, startDate: "2008-10-26", salary: "$235,500" },
    { name: "Lael Greer", position: "Systems Administrator", office: "London", age: 21, startDate: "2009-02-27", salary: "$103,500" },
    { name: "Gloria Little", position: "Systems Administrator", office: "New York", age: 59, startDate: "2009-04-10", salary: "$237,500" },
    { name: "Tiger Nixon", position: "System Architect", office: "Edinburgh", age: 61, startDate: "2011-04-25", salary: "$320,800" },
    { name: "Gavin Cortez", position: "Team Leader", office: "San Francisco", age: 22, startDate: "2008-10-26", salary: "$235,500" },
    { name: "Lael Greer", position: "Systems Administrator", office: "London", age: 21, startDate: "2009-02-27", salary: "$103,500" },
    { name: "Gloria Little", position: "Systems Administrator", office: "New York", age: 59, startDate: "2009-04-10", salary: "$237,500" },
    { name: "Tiger Nixon", position: "System Architect", office: "Edinburgh", age: 61, startDate: "2011-04-25", salary: "$320,800" },
    { name: "Prescott Bartlett", position: "Technical Author", office: "London", age: 27, startDate: "2011-05-07", salary: "$145,000" },
    { name: "Gavin Cortez", position: "Team Leader", office: "San Francisco", age: 22, startDate: "2008-10-26", salary: "$235,500" },
    { name: "Lael Greer", position: "Systems Administrator", office: "London", age: 21, startDate: "2009-02-27", salary: "$103,500" },
    { name: "Gloria Little", position: "Systems Administrator", office: "New York", age: 59, startDate: "2009-04-10", salary: "$237,500" },
    { name: "Tiger Nixon", position: "System Architect", office: "Edinburgh", age: 61, startDate: "2011-04-25", salary: "$320,800" },
    { name: "Prescott Bartlett", position: "Technical Author", office: "London", age: 27, startDate: "2011-05-07", salary: "$145,000" },
    { name: "Gavin Cortez", position: "Team Leader", office: "San Francisco", age: 22, startDate: "2008-10-26", salary: "$235,500" },
    { name: "Lael Greer", position: "Systems Administrator", office: "London", age: 21, startDate: "2009-02-27", salary: "$103,500" },
    { name: "Gloria Little", position: "Systems Administrator", office: "New York", age: 59, startDate: "2009-04-10", salary: "$237,500" },
    { name: "Tiger Nixon", position: "System Architect", office: "Edinburgh", age: 61, startDate: "2011-04-25", salary: "$320,800" },
    { name: "Prescott Bartlett", position: "Technical Author", office: "London", age: 27, startDate: "2011-05-07", salary: "$145,000" },
    { name: "Gavin Cortez", position: "Team Leader", office: "San Francisco", age: 22, startDate: "2008-10-26", salary: "$235,500" },
    { name: "Lael Greer", position: "Systems Administrator", office: "London", age: 21, startDate: "2009-02-27", salary: "$103,500" },
    { name: "Gloria Little", position: "Systems Administrator", office: "New York", age: 59, startDate: "2009-04-10", salary: "$237,500" },
    { name: "Tiger Nixon", position: "System Architect", office: "Edinburgh", age: 61, startDate: "2011-04-25", salary: "$320,800" },
    // ...add more realistic rows if needed (avoid huge duplicates)
  ];

  // --- Table UI state ---
  filteredData: Employee[] = [];
  paginatedData: Employee[] = [];
  searchTerm: string = '';
  entriesPerPage: number = 10;
  currentPage: number = 1;

  // --- Column resize state ---
  private isResizing = false;
  private resizeColumnEl: HTMLElement | null = null;
  private startX = 0;
  private startWidth = 0;

  // event handler references so we can remove listeners
  private boundDoResize = this.doResize.bind(this);
  private boundStopResize = this.stopResize.bind(this);

  ngOnInit() {
    this.filteredData = [...this.employees];
    this.updatePage();
  }

  ngOnDestroy() {
    // cleanup any global listeners (in case still attached)
    this.document.removeEventListener('mousemove', this.boundDoResize);
    this.document.removeEventListener('mouseup', this.boundStopResize);
  }

  // -----------------------
  // Search & Pagination
  // -----------------------
  onSearch() {
    const q = this.searchTerm.trim().toLowerCase();
    if (!q) {
      this.filteredData = [...this.employees];
    } else {
      this.filteredData = this.employees.filter(emp =>
        Object.values(emp).some(val =>
          val?.toString().toLowerCase().includes(q)
        )
      );
    }
    this.currentPage = 1;
    // preserve sort after search
    if (this.sortState.length) {
      this.applySort();
    }
    this.updatePage();
  }

  get totalPages() {
    return Math.max(1, Math.ceil(this.filteredData.length / this.entriesPerPage));
  }

  updatePage() {
    this.entriesPerPage=Number(this.entriesPerPage);
    const start = (this.currentPage - 1) * this.entriesPerPage; // 2-1*10
    console.log(typeof start,typeof this.entriesPerPage);
    
    const end:number = start + this.entriesPerPage;
    console.log(start,end);
    console.log(this.filteredData);
    console.log(this.filteredData.slice(start,end));
    this.paginatedData = this.filteredData.slice(start, end);
  }

  changePage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.updatePage();
  }

  // when user changes entriesPerPage
  onEntriesPerPageChange() {
    console.log(this.entriesPerPage);
    this.currentPage = 1;
    this.updatePage();
  }

  // -----------------------
  // Sorting: multi-column
  // -----------------------
  // helper for template to show ▲ / ▼
  getSortIcon(column: keyof Employee) {
    const sort = this.sortState.find(s => s.column === column);
    if (!sort) return '';
    return sort.direction === 'asc' ? '▲' : '▼';
  }

  sortBy(column: keyof Employee, event?: MouseEvent) {
    const multi = !!event?.shiftKey;
    const existingIndex = this.sortState.findIndex(s => s.column === column);

    if (!multi) {
      // single-column: if clicked same column, toggle; otherwise replace
      if (existingIndex >= 0) {
        this.sortState[existingIndex].direction =
          this.sortState[existingIndex].direction === 'asc' ? 'desc' : 'asc';
      } else {
        this.sortState = [{ column, direction: 'asc' }];
      }
    } else {
      // multi-column (shift+click)
      if (existingIndex >= 0) {
        this.sortState[existingIndex].direction =
          this.sortState[existingIndex].direction === 'asc' ? 'desc' : 'asc';
      } else {
        this.sortState.push({ column, direction: 'asc' });
      }
    }

    this.applySort();
    this.updatePage();
  }

  private applySort() {
    // stable multi-column comparator
    this.filteredData.sort((a, b) => {
      for (const s of this.sortState) {
        const x = a[s.column];
        const y = b[s.column];

        // normalize strings to lower-case for consistent ordering
        const nx = typeof x === 'string' ? x.toLowerCase() : x;
        const ny = typeof y === 'string' ? y.toLowerCase() : y;

        if (nx < ny) return s.direction === 'asc' ? -1 : 1;
        if (nx > ny) return s.direction === 'asc' ? 1 : -1;
        // otherwise equal -> continue to next sort key
      }
      return 0;
    });
  }

  // -----------------------
  // Edit modal (open/close/save)
  // -----------------------
  editEmployee(emp: Employee) {
    this.editingEmployee = emp;
    this.tempEmployee = { ...emp }; // copy for editing
    // open modal with animation
    this.showEditModal = true;
    // small delay so CSS transition runs
    setTimeout(() => this.modalAnimation = true, 10);
  }

  saveEmployee() {
    if (this.editingEmployee && this.tempEmployee) {
      Object.assign(this.editingEmployee, this.tempEmployee);
      // refresh filtered/paginated views to show updated values
      this.onSearch(); // will reapply sort & update page
    }
    this.closeModal();
  }

  closeModal() {
    // play closing animation first
    this.modalAnimation = false;
    setTimeout(() => {
      this.showEditModal = false;
      this.editingEmployee = null;
      this.tempEmployee = null;
    }, 180); // match CSS duration
  }

  // -----------------------
  // Delete
  // -----------------------
  deleteEmployee(emp: Employee) {
    if (!confirm(`Delete ${emp.name}?`)) return;
    this.employees = this.employees.filter(e => e !== emp);
    // refresh filtered and paginated lists
    this.onSearch();
  }

  // -----------------------
  // Column resize (no libraries)
  // -----------------------
  // Called from template: startResize($event, 'name', nameHeader)
  startResize(event: MouseEvent, _columnKey: string, thEl: HTMLElement) {
    event.preventDefault();
    this.isResizing = true;
    this.resizeColumnEl = thEl;
    this.startX = event.pageX;
    this.startWidth = thEl.offsetWidth;

    document.addEventListener('mousemove', this.boundDoResize);
    document.addEventListener('mouseup', this.boundStopResize);
  }

  private doResize(evt: MouseEvent) {
    if (!this.isResizing || !this.resizeColumnEl) return;
    const delta = evt.pageX - this.startX;
    const newWidth = Math.max(60, this.startWidth + delta); // minimum width = 60px
    // set inline width style; table will adapt
    this.resizeColumnEl.style.width = `${newWidth}px`;
  }

  private stopResize() {
    this.isResizing = false;
    this.resizeColumnEl = null;
    document.removeEventListener('mousemove', this.boundDoResize);
    document.removeEventListener('mouseup', this.boundStopResize);
  }
}
