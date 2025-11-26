import { CommonModule, TitleCasePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

type EmployeeKey = keyof Employee;

@Component({
  selector: 'app-employee-table',
  standalone: true,
  imports: [CommonModule, FormsModule, TitleCasePipe],
  templateUrl: './employee-table.html'
})
export class EmployeeTable implements OnInit, OnDestroy {
  Math: Math = Math
  columns: { key: EmployeeKey; label: string }[] = [
    { key: "name", label: "Name" },
    { key: "position", label: "Position" },
    { key: "office", label: "Office" },
    { key: "age", label: "Age" },
    { key: "startDate", label: "Start Date" },
    { key: "salary", label: "Salary" },
    { key: "address", label: "Address" }
  ];

  showEditModal = false;
  modalAnimation = false;
  editingEmployee: Employee | null = null;
  tempEmployee: Employee | null = null;

  sortState: { column: EmployeeKey; direction: 'asc' | 'desc' }[] = [];

  employees: Employee[] = [
    { name: "Aman Tiwari", position: "Software Engineer", office: "Noida", age: 26, startDate: "2021-07-10", salary: "$120,000", address: "Sector 62, Noida" },
    { name: "Riya Sharma", position: "UI/UX Designer", office: "Gurgaon", age: 24, startDate: "2022-01-18", salary: "$95,000", address: "DLF Phase 3" },
    { name: "Mohit Verma", position: "Backend Developer", office: "Bangalore", age: 28, startDate: "2020-11-02", salary: "$135,000", address: "Electronic City" },
    { name: "Anita Desai", position: "HR Manager", office: "Mumbai", age: 34, startDate: "2019-03-27", salary: "$150,000", address: "Andheri West" },
    { name: "Arjun Mehta", position: "Team Lead", office: "Pune", age: 31, startDate: "2018-09-15", salary: "$180,000", address: "Viman Nagar" },
    { name: "Neha Agarwal", position: "QA Engineer", office: "Noida", age: 29, startDate: "2022-05-07", salary: "$110,000", address: "Sector 63" },
    { name: "Rohit Singh", position: "Scrum Master", office: "Remote", age: 33, startDate: "2020-06-14", salary: "$160,000" },
    { name: "Sneha Kapoor", position: "Data Analyst", office: "Delhi", age: 27, startDate: "2021-12-19", salary: "$128,000" },
    { name: "Harshit Jain", position: "Frontend Dev", office: "Hyderabad", age: 25, startDate: "2023-02-09", salary: "$105,000" },
    { name: "Aisha Khan", position: "ML Engineer", office: "Bangalore", age: 30, startDate: "2022-04-22", salary: "$170,000" },
    { name: "Varun Sethi", position: "DevOps Engineer", office: "Chennai", age: 32, startDate: "2019-07-30", salary: "$165,000" },
    { name: "Karan Patel", position: "Network Engineer", office: "Mumbai", age: 36, startDate: "2017-01-12", salary: "$150,000", address: "Juhu" },
    { name: "Sakshi Malhotra", position: "Digital Marketer", office: "Delhi", age: 28, startDate: "2021-08-05", salary: "$98,000", address: "Rohini" },
    { name: "Nishant Kumar", position: "Database Engineer", office: "Pune", age: 29, startDate: "2020-05-18", salary: "$140,000" },
    { name: "Tanya Singh", position: "Business Analyst", office: "Noida", age: 26, startDate: "2023-01-22", salary: "$125,000" },
    { name: "Vikram Rana", position: "Full Stack Dev", office: "Gurgaon", age: 27, startDate: "2022-10-09", salary: "$145,000" },
    { name: "Saurabh Mishra", position: "Cloud Architect", office: "Bangalore", age: 38, startDate: "2016-03-01", salary: "$220,000" },
    { name: "Deepika Rao", position: "Project Manager", office: "Hyderabad", age: 35, startDate: "2018-12-15", salary: "$190,000" },
    { name: "Yash Gupta", position: "Tech Support", office: "Delhi", age: 24, startDate: "2023-04-11", salary: "$80,000" },
    { name: "Simran Kaur", position: "Content Writer", office: "Remote", age: 25, startDate: "2022-11-07", salary: "$75,000" },
    { name: "Prateek Bansal", position: "Android Developer", office: "Bangalore", age: 27, startDate: "2020-06-23", salary: "$130,000" },
    { name: "Megha Rathi", position: "iOS Developer", office: "Chennai", age: 29, startDate: "2021-03-13", salary: "$132,000" },
    { name: "Siddharth Sharma", position: "Security Engineer", office: "Pune", age: 33, startDate: "2019-10-02", salary: "$175,000" },
    { name: "Rajeev Chauhan", position: "Tech Lead", office: "Noida", age: 37, startDate: "2017-05-04", salary: "$210,000" },
    { name: "Shreya Pandit", position: "Product Owner", office: "Gurgaon", age: 32, startDate: "2020-01-20", salary: "$200,000" },
    { name: "Aditya Raj", position: "Research Engineer", office: "Hyderabad", age: 28, startDate: "2021-06-01", salary: "$150,000" },
    { name: "Priya Verma", position: "HR Executive", office: "Mumbai", age: 30, startDate: "2022-12-05", salary: "$95,000" },
    { name: "Akhil Arya", position: "Sales Manager", office: "Delhi", age: 40, startDate: "2015-08-18", salary: "$250,000" },
    { name: "Aparna Joshi", position: "Support Engineer", office: "Chennai", age: 26, startDate: "2023-02-01", salary: "$85,000" }
  ]
    ;

  filteredData: Employee[] = [];
  paginatedData: Employee[] = [];

  searchTerm = '';
  entriesPerPage = 10;
  currentPage = 1;

  // COLUMN RESIZE
  private isResizing = false;
  private resizeColumnEl: HTMLElement | null = null;
  private startX = 0;
  private startWidth = 0;
  private boundDoResize = this.doResize.bind(this);
  private boundStopResize = this.stopResize.bind(this);

  ngOnInit() {
    this.filteredData = [...this.employees];
    this.updatePage();
  }

  ngOnDestroy() {
    document.removeEventListener('mousemove', this.boundDoResize);
    document.removeEventListener('mouseup', this.boundStopResize);
  }

  onSearch() {
    const term = this.searchTerm.toLowerCase();
    this.filteredData = this.employees.filter(emp =>
      Object.values(emp).some(v => (v ?? "").toString().toLowerCase().includes(term))
    );
    this.currentPage = 1;
    if (this.sortState.length) this.applySort();
    this.updatePage();
  }

  get totalPages() {
    return Math.ceil(this.filteredData.length / this.entriesPerPage);
  }

  updatePage() {
    this.entriesPerPage = Number(this.entriesPerPage); // force to number
    const start = (this.currentPage - 1) * this.entriesPerPage;
    const end = start + this.entriesPerPage;
    this.paginatedData = this.filteredData.slice(start, end);
  }

  changePage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.updatePage();
  }

  getSortIcon(column: EmployeeKey) {
    const s = this.sortState.find(s => s.column === column);
    return s ? (s.direction === 'asc' ? '▲' : '▼') : '';
  }

  sortBy(column: EmployeeKey, event?: MouseEvent) {
    const multi = event?.shiftKey;
    const index = this.sortState.findIndex(s => s.column === column);

    if (!multi) {
      if (index >= 0) this.sortState[index].direction =
        this.sortState[index].direction === 'asc' ? 'desc' : 'asc';
      else this.sortState = [{ column, direction: 'asc' }];
    } else {
      if (index >= 0) this.sortState[index].direction =
        this.sortState[index].direction === 'asc' ? 'desc' : 'asc';
      else this.sortState.push({ column, direction: 'asc' });
    }

    this.applySort();
    this.updatePage();
  }

  private applySort() {
    this.filteredData.sort((a, b) => {
      for (const s of this.sortState) {
        const x = a[s.column] ?? null;
        const y = b[s.column] ?? null;

        const nx = typeof x === "string" ? x.toLowerCase() : x;
        const ny = typeof y === "string" ? y.toLowerCase() : y;

        if (nx === null && ny === null) continue;
        if (nx === null) return s.direction === "asc" ? -1 : 1;
        if (ny === null) return s.direction === "asc" ? 1 : -1;

        if (nx < ny) return s.direction === "asc" ? -1 : 1;
        if (nx > ny) return s.direction === "asc" ? 1 : -1;
      }
      return 0;
    });
  }

  editEmployee(emp: Employee) {
    this.editingEmployee = emp;
    this.tempEmployee = { ...emp };
    this.showEditModal = true;
    setTimeout(() => this.modalAnimation = true, 10);
  }

  saveEmployee() {
    if (this.editingEmployee && this.tempEmployee) {
      Object.assign(this.editingEmployee, this.tempEmployee);
      this.onSearch();
    }
    this.closeModal();
  }

  closeModal() {
    this.modalAnimation = false;
    setTimeout(() => {
      this.showEditModal = false;
      this.tempEmployee = null;
      this.editingEmployee = null;
    }, 200);
  }

  deleteEmployee(emp: Employee) {
    if (confirm(`Delete ${emp.name}?`)) {
      this.employees = this.employees.filter(e => e !== emp);
      this.onSearch();
    }
  }

  // COLUMN RESIZE
  startResize(event: MouseEvent, th: HTMLElement) {
    const target = event.target as HTMLElement | null;
    if (!target) return;

    this.isResizing = true;
    this.resizeColumnEl = th;  // Use reference from template
    this.startX = event.pageX;
    this.startWidth = th.offsetWidth;

    document.addEventListener('mousemove', this.boundDoResize);
    document.addEventListener('mouseup', this.boundStopResize);
  }


  private doResize(e: MouseEvent) {
    if (!this.isResizing || !this.resizeColumnEl) return;
    const newW = Math.max(60, this.startWidth + (e.pageX - this.startX));
    this.resizeColumnEl.style.width = `${newW}px`;
  }

  private stopResize() {
    this.isResizing = false;
    this.resizeColumnEl = null;
    document.removeEventListener('mousemove', this.boundDoResize);
    document.removeEventListener('mouseup', this.boundStopResize);
  }
  get pageNumbers(): number[] {
    const pages: number[] = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }
}
