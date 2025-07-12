// ===========================================
// MOCK DATA
// ===========================================
const mockEmployees = [
  {
    id: 1,
    firstName: "Alice",
    lastName: "Smith",
    email: "alice@example.com",
    department: "HR",
    role: "Manager",
  },
  {
    id: 2,
    firstName: "Bob",
    lastName: "Johnson",
    email: "bob@example.com",
    department: "IT",
    role: "Developer",
  },
  {
    id: 3,
    firstName: "Charlie",
    lastName: "Lee",
    email: "charlie@example.com",
    department: "Finance",
    role: "Analyst",
  },
  {
    id: 4,
    firstName: "Diana",
    lastName: "Wilson",
    email: "diana@example.com",
    department: "Marketing",
    role: "Manager",
  },
  {
    id: 5,
    firstName: "Eve",
    lastName: "Brown",
    email: "eve@example.com",
    department: "IT",
    role: "Designer",
  },
  {
    id: 6,
    firstName: "Frank",
    lastName: "Davis",
    email: "frank@example.com",
    department: "Finance",
    role: "Manager",
  },
];

// ===========================================
// EMPLOYEE DIRECTORY CLASS
// ===========================================
class EmployeeDirectory {
  constructor() {
    this.employees = [...mockEmployees]; // Start with mock data
    this.currentPage = 1;
    this.itemsPerPage = 10;
    this.currentSort = "";
    this.searchTerm = "";

    // Filter state
    this.filters = {
      name: "",
      department: "",
      role: "",
    };

    this.initializeElements();
    this.setupEventListeners();
    this.renderEmployees();
  }

  // ===========================================
  // DOM ELEMENT REFERENCES
  // ===========================================
  initializeElements() {
    this.elements = {
      employeeList: document.getElementById("employee-list-container"),
      searchInput: document.getElementById("search-input"),
      sortSelect: document.getElementById("sort-select"),
      showSelect: document.getElementById("show-select"),
      addEmployeeBtn: document.getElementById("add-employee-btn"),

      // Modal elements
      formModal: document.getElementById("employee-form-modal"),
      employeeForm: document.getElementById("employee-form"),
      formTitle: document.getElementById("form-title"),
      formErrors: document.getElementById("form-errors"),
      cancelBtn: document.getElementById("cancel-btn"),

      // Filter elements
      filterBtn: document.getElementById("filter-btn"),
      filterSidebar: document.getElementById("filter-sidebar"),
      filterOverlay: document.getElementById("filter-overlay"),
      closeFilter: document.getElementById("close-filter"),
      filterName: document.getElementById("filter-name"),
      filterDepartment: document.getElementById("filter-department"),
      filterRole: document.getElementById("filter-role"),
      applyFilters: document.getElementById("apply-filters"),
      clearFilters: document.getElementById("clear-filters"),

      // Pagination elements
      paginationContainer: document.getElementById("pagination-container"),
      paginationInfo: document.getElementById("pagination-info"),
      prevPage: document.getElementById("prev-page"),
      nextPage: document.getElementById("next-page"),
      pageNumbers: document.getElementById("page-numbers"),
    };
  }

  // ===========================================
  // EVENT LISTENERS SETUP
  // ===========================================
  setupEventListeners() {
    // Search functionality
    if (this.elements.searchInput) {
      this.elements.searchInput.addEventListener("input", (e) => {
        this.searchTerm = e.target.value.toLowerCase();
        this.currentPage = 1;
        this.renderEmployees();
      });
    }

    // Sorting functionality
    if (this.elements.sortSelect) {
      this.elements.sortSelect.addEventListener("change", (e) => {
        this.currentSort = e.target.value;
        this.renderEmployees();
      });
    }

    // Items per page
    if (this.elements.showSelect) {
      this.elements.showSelect.addEventListener("change", (e) => {
        this.itemsPerPage = parseInt(e.target.value, 10);
        this.currentPage = 1;
        this.renderEmployees();
      });
    }

    // Add employee button
    if (this.elements.addEmployeeBtn) {
      this.elements.addEmployeeBtn.addEventListener("click", () => {
        this.openForm("add");
      });
    }

    // Form submission
    if (this.elements.employeeForm) {
      this.elements.employeeForm.addEventListener("submit", (e) => {
        e.preventDefault();
        this.handleFormSubmission();
      });
    }

    // Cancel button
    if (this.elements.cancelBtn) {
      this.elements.cancelBtn.addEventListener("click", () => {
        this.closeForm();
      });
    }

    // Filter functionality
    if (this.elements.filterBtn) {
      this.elements.filterBtn.addEventListener("click", () => {
        this.openFilterSidebar();
      });
    }

    if (this.elements.closeFilter) {
      this.elements.closeFilter.addEventListener("click", () => {
        this.closeFilterSidebar();
      });
    }

    if (this.elements.filterOverlay) {
      this.elements.filterOverlay.addEventListener("click", () => {
        this.closeFilterSidebar();
      });
    }

    if (this.elements.applyFilters) {
      this.elements.applyFilters.addEventListener("click", () => {
        this.applyFilters();
      });
    }

    if (this.elements.clearFilters) {
      this.elements.clearFilters.addEventListener("click", () => {
        this.clearAllFilters();
      });
    }

    // Pagination functionality
    if (this.elements.prevPage) {
      this.elements.prevPage.addEventListener("click", () => {
        this.goToPage(this.currentPage - 1);
      });
    }

    if (this.elements.nextPage) {
      this.elements.nextPage.addEventListener("click", () => {
        this.goToPage(this.currentPage + 1);
      });
    }
  }

  // ===========================================
  // FILTER FUNCTIONALITY
  // ===========================================
  openFilterSidebar() {
    this.elements.filterSidebar.classList.add("open");
    this.elements.filterOverlay.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  closeFilterSidebar() {
    this.elements.filterSidebar.classList.remove("open");
    this.elements.filterOverlay.classList.remove("open");
    document.body.style.overflow = "auto";
  }

  populateFilterOptions() {
    // This method is no longer needed since we're using text inputs
    // The filter inputs are already in the HTML
  }

  updateFilterState() {
    // Update name filter
    this.filters.name = this.elements.filterName.value.toLowerCase();

    // Update department filter
    this.filters.department =
      this.elements.filterDepartment.value.toLowerCase();

    // Update role filter
    this.filters.role = this.elements.filterRole.value.toLowerCase();
  }

  applyFilters() {
    this.updateFilterState();
    this.currentPage = 1;
    this.renderEmployees();
    this.closeFilterSidebar();
  }

  clearAllFilters() {
    // Clear name filter
    this.elements.filterName.value = "";

    // Clear department filter
    this.elements.filterDepartment.value = "";

    // Clear role filter
    this.elements.filterRole.value = "";

    // Reset filter state
    this.filters = {
      name: "",
      department: "",
      role: "",
    };

    this.currentPage = 1;
    this.renderEmployees();
  }

  // ===========================================
  // EMPLOYEE RENDERING
  // ===========================================
  renderEmployees() {
    const filteredEmployees = this.getFilteredEmployees();
    const sortedEmployees = this.sortEmployees(filteredEmployees);
    const paginatedEmployees = this.paginateEmployees(sortedEmployees);

    this.displayEmployees(paginatedEmployees);
    this.renderPagination(filteredEmployees.length);
  }

  getFilteredEmployees() {
    return this.employees.filter((employee) => {
      const fullName =
        `${employee.firstName} ${employee.lastName}`.toLowerCase();

      // Search filter
      const matchesSearch =
        fullName.includes(this.searchTerm) ||
        employee.email.toLowerCase().includes(this.searchTerm);

      // Name filter
      const matchesName =
        !this.filters.name || fullName.includes(this.filters.name);

      // Department filter
      const matchesDepartment =
        !this.filters.department ||
        employee.department.toLowerCase().includes(this.filters.department);

      // Role filter
      const matchesRole =
        !this.filters.role ||
        employee.role.toLowerCase().includes(this.filters.role);

      return matchesSearch && matchesName && matchesDepartment && matchesRole;
    });
  }

  sortEmployees(employees) {
    if (this.currentSort === "name") {
      return employees.sort((a, b) =>
        (a.firstName + a.lastName).localeCompare(b.firstName + b.lastName)
      );
    } else if (this.currentSort === "department") {
      return employees.sort((a, b) => a.department.localeCompare(b.department));
    }
    return employees;
  }

  paginateEmployees(employees) {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return employees.slice(start, end);
  }

  displayEmployees(employees) {
    if (!this.elements.employeeList) return;

    this.elements.employeeList.innerHTML = "";

    if (employees.length === 0) {
      this.elements.employeeList.innerHTML = `
              <div style="text-align: center; padding: 40px; color: #666;">
                <h3>No employees found</h3>
                <p>Try adjusting your search or filter criteria.</p>
              </div>
            `;
      return;
    }

    employees.forEach((employee) => {
      const employeeCard = this.createEmployeeCard(employee);
      this.elements.employeeList.appendChild(employeeCard);
    });
  }

  createEmployeeCard(employee) {
    const card = document.createElement("div");
    card.className = "employee-card";
    card.setAttribute("data-employee-id", employee.id);

    card.innerHTML = `
            <div class="employee-info">
              <h3 class="employee-name">${employee.firstName} ${employee.lastName}</h3>
              <p class="employee-email"><strong>Email:</strong> ${employee.email}</p>
              <p class="employee-department"><strong>Department:</strong> ${employee.department}</p>
              <p class="employee-role"><strong>Role:</strong> ${employee.role}</p>
            </div>
            <div class="employee-actions">
              <button class="edit-btn" data-id="${employee.id}">Edit</button>
              <button class="delete-btn" data-id="${employee.id}">Delete</button>
            </div>
          `;

    // Add event listeners to buttons
    this.addCardEventListeners(card, employee.id);

    return card;
  }

  addCardEventListeners(card, employeeId) {
    const editBtn = card.querySelector(".edit-btn");
    const deleteBtn = card.querySelector(".delete-btn");

    editBtn.addEventListener("click", () => this.openForm("edit", employeeId));
    deleteBtn.addEventListener("click", () => this.deleteEmployee(employeeId));
  }

  // ===========================================
  // PAGINATION FUNCTIONALITY
  // ===========================================
  renderPagination(totalEmployees) {
    const totalPages = Math.ceil(totalEmployees / this.itemsPerPage);

    // Update pagination info
    const start = (this.currentPage - 1) * this.itemsPerPage + 1;
    const end = Math.min(this.currentPage * this.itemsPerPage, totalEmployees);

    if (this.elements.paginationInfo) {
      this.elements.paginationInfo.textContent =
        totalEmployees > 0
          ? `Showing ${start} to ${end} of ${totalEmployees} employees`
          : "No employees found";
    }

    // Update previous/next buttons
    if (this.elements.prevPage) {
      this.elements.prevPage.disabled = this.currentPage <= 1;
    }

    if (this.elements.nextPage) {
      this.elements.nextPage.disabled = this.currentPage >= totalPages;
    }

    // Render page numbers
    this.renderPageNumbers(totalPages);
  }

  renderPageNumbers(totalPages) {
    if (!this.elements.pageNumbers) return;

    this.elements.pageNumbers.innerHTML = "";

    if (totalPages <= 1) return;

    const maxVisiblePages = 5;
    let startPage = Math.max(
      1,
      this.currentPage - Math.floor(maxVisiblePages / 2)
    );
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    // Adjust start page if we're near the end
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // Add first page and ellipsis if needed
    if (startPage > 1) {
      this.addPageNumber(1);
      if (startPage > 2) {
        this.addEllipsis();
      }
    }

    // Add visible page numbers
    for (let i = startPage; i <= endPage; i++) {
      this.addPageNumber(i);
    }

    // Add last page and ellipsis if needed
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        this.addEllipsis();
      }
      this.addPageNumber(totalPages);
    }
  }

  addPageNumber(pageNum) {
    const pageBtn = document.createElement("button");
    pageBtn.className = "page-number";
    pageBtn.textContent = pageNum;

    if (pageNum === this.currentPage) {
      pageBtn.classList.add("active");
    }

    pageBtn.addEventListener("click", () => {
      this.goToPage(pageNum);
    });

    this.elements.pageNumbers.appendChild(pageBtn);
  }

  addEllipsis() {
    const ellipsis = document.createElement("span");
    ellipsis.textContent = "...";
    ellipsis.style.padding = "0 8px";
    ellipsis.style.color = "#6c757d";
    this.elements.pageNumbers.appendChild(ellipsis);
  }

  goToPage(pageNum) {
    const totalEmployees = this.getFilteredEmployees().length;
    const totalPages = Math.ceil(totalEmployees / this.itemsPerPage);

    if (pageNum >= 1 && pageNum <= totalPages) {
      this.currentPage = pageNum;
      this.renderEmployees();
    }
  }

  // ===========================================
  // FORM HANDLING
  // ===========================================
  openForm(mode, employeeId = null) {
    if (!this.elements.formModal) return;

    this.elements.formModal.classList.remove("hidden");
    this.elements.formErrors.textContent = "";
    this.elements.employeeForm.reset();

    if (mode === "edit" && employeeId) {
      this.populateFormForEdit(employeeId);
      this.elements.formTitle.textContent = "Edit Employee";
    } else {
      this.elements.formTitle.textContent = "Add Employee";
      document.getElementById("employee-id").value = "";
    }
  }

  populateFormForEdit(employeeId) {
    const employee = this.employees.find((emp) => emp.id == employeeId);
    if (!employee) return;

    const formFields = {
      "employee-id": employee.id,
      "first-name": employee.firstName,
      "last-name": employee.lastName,
      email: employee.email,
      department: employee.department,
      role: employee.role,
    };

    Object.entries(formFields).forEach(([fieldId, value]) => {
      const field = document.getElementById(fieldId);
      if (field) field.value = value;
    });
  }

  closeForm() {
    if (!this.elements.formModal) return;

    this.elements.formModal.classList.add("hidden");
    this.elements.employeeForm.reset();
    this.elements.formErrors.textContent = "";
  }

  handleFormSubmission() {
    if (!this.validateForm()) return;

    const formData = this.getFormData();

    if (formData.id) {
      this.updateEmployee(formData);
    } else {
      this.addEmployee(formData);
    }

    this.closeForm();
    this.renderEmployees();
  }

  getFormData() {
    return {
      id: document.getElementById("employee-id").value,
      firstName: document.getElementById("first-name").value.trim(),
      lastName: document.getElementById("last-name").value.trim(),
      email: document.getElementById("email").value.trim(),
      department: document.getElementById("department").value.trim(),
      role: document.getElementById("role").value.trim(),
    };
  }

  validateForm() {
    const formData = this.getFormData();
    const errors = [];

    // Check required fields
    if (!formData.firstName) errors.push("First name is required.");
    if (!formData.lastName) errors.push("Last name is required.");
    if (!formData.email) errors.push("Email is required.");
    if (!formData.department) errors.push("Department is required.");
    if (!formData.role) errors.push("Role is required.");

    // Validate email format
    if (formData.email && !this.isValidEmail(formData.email)) {
      errors.push("Please enter a valid email address.");
    }

    // Display errors if any
    if (errors.length > 0) {
      this.elements.formErrors.textContent = errors.join(" ");
      return false;
    }

    return true;
  }

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // ===========================================
  // EMPLOYEE CRUD OPERATIONS
  // ===========================================
  addEmployee(employeeData) {
    const newId =
      this.employees.length > 0
        ? Math.max(...this.employees.map((emp) => emp.id)) + 1
        : 1;

    const newEmployee = {
      id: newId,
      ...employeeData,
    };

    this.employees.push(newEmployee);
  }

  updateEmployee(employeeData) {
    const employeeIndex = this.employees.findIndex(
      (emp) => emp.id == employeeData.id
    );
    if (employeeIndex !== -1) {
      this.employees[employeeIndex] = {
        ...this.employees[employeeIndex],
        ...employeeData,
      };
    }
  }

  deleteEmployee(employeeId) {
    if (confirm("Are you sure you want to delete this employee?")) {
      this.employees = this.employees.filter((emp) => emp.id != employeeId);
      this.renderEmployees();
    }
  }
}

// ===========================================
// INITIALIZE THE APPLICATION
// ===========================================
document.addEventListener("DOMContentLoaded", () => {
  new EmployeeDirectory();
});
