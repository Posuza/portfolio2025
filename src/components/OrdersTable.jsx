import React, { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useStore } from "../store/store";
import { FaArrowLeftLong, FaArrowRightLong } from "react-icons/fa6";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { RiArrowRightDoubleFill } from "react-icons/ri";
import { PiSortAscendingBold, PiSortDescendingBold } from "react-icons/pi";
import { TbAugmentedReality } from "react-icons/tb";
import { TiDelete } from "react-icons/ti";
import { useTheme } from "../context/ThemeContext";
import { TiArrowSortedDown, TiArrowSortedUp } from "react-icons/ti";
import { TiMinusOutline } from "react-icons/ti";
import { MdDeleteSweep } from "react-icons/md";
import { toast } from "react-toastify";
import DeleteModal from "./popUps/Delete";
import WarningModal from "./popUps/Warning";
import BulkDeleteModal from "./popUps/BulkDelete";
import { useTranslation } from "react-i18next";
import {localTime} from "../utils/localTime"

const OrdersTable = () => {
  // ALL HOOKS FIRST - NEVER CHANGE THIS ORDER
  const navigate = useNavigate();
  const location = useLocation();
  const orders = useStore((state) => state.orders);
  const ordersLoading = useStore((state) => state.ordersLoading);
  const ordersError = useStore((state) => state.ordersError);
  const ordersPagination = useStore((state) => state.ordersPagination);
  const fetchOrdersPage = useStore((state) => state.fetchOrdersPage);
  const { colors, isDark } = useTheme();
  const { t } = useTranslation("orders");

  // ALL useState HOOKS
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showBulkSelect, setShowBulkSelect] = useState(false);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [sort, setSort] = useState("desc");
  const [sortBy, setSortBy] = useState("created_at");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteOrderId, setDeleteOrderId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [warningMessage, setWarningMessage] = useState("");
  const [warningConfirm, setWarningConfirm] = useState(() => () => {});
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);
  const [bulkDeleteLoading, setBulkDeleteLoading] = useState(false);
  const [bulkDeleteError, setBulkDeleteError] = useState(null);
  const [showOrderNew, setShowOrderNew] = useState(false);

  // ALL useRef HOOKS
  const headerRef = useRef(null);
  const bodyRef = useRef(null);
  const columnRefs = useRef({});

  // COMPUTED VALUES
  const safePagination = ordersPagination || {
    total_count: 0,
    current_page: 1,
    per_page: 20,
    total_pages: 1,
    has_next: false,
    has_prev: false,
  };

  const currentPage = safePagination.current_page;
  const rowsPerPage = safePagination.per_page;
  const totalPages = safePagination.total_pages;
  const safeOrders = Array.isArray(orders) ? orders : [];

  // CONSTANTS
  const orderStatuses = ["new", "in_progress", "done", "cancled"];

  const columns = [
    "order_no",         // Order number
    "order_date",       // Created date
    "status",           // Order status
    "items",            // Number of items
    "total_amount",     // Total order amount
    "delivery_snapshot",    // Delivery name/address
    "completed_date",   // Completed date
    "updated_at",       // Last updated
  ];

  // Replace your columnWidthClasses with responsive classes for mobile and medium screens:
  const columnWidthClasses = {
    order_no: "w-[11px] md:w-[120px]",
    order_date: "w-[9px] md:w-[110px]",
    items: "w-[5px] md:w-[110px]",
    total_amount: "w-[10px] md:w-[90px]",
    status: "w-[10px] md:w-[110px]",
    delivery_snapshot: "w-[15px] md:w-[120px]",
    completed_date: "w-[9px] md:w-[110px]",
    updated_at: "w-[9px] md:w-[110px]",
  };

  // FUNCTIONS
  const buildFilters = () => {
    let filters = {};
    if (
      statusFilter &&
      ((typeof search === "string" && search.trim() !== "") ||
        (typeof search === "object" &&
          ((search.min && search.min !== "") ||
            (search.max && search.max !== "") ||
            (search.from && search.from !== "") ||
            (search.to && search.to !== ""))))
    ) {
      filters.searchType = statusFilter;
      if (typeof search === "object") {
        if (statusFilter === "total_amount" || statusFilter === "items") {
          const min = search.min || "";
          const max = search.max || "";
          if (min !== "" || max !== "") {
            filters.searchValue = `${min}-${max}`;
          }
        } else if (
          statusFilter === "order_date" ||
          statusFilter === "completed_date" ||
          statusFilter === "updated_at"
        ) {
          const from = search.from || "";
          const to = search.to || "";
          if (from !== "" || to !== "") {
            filters.searchValue = `${from}|${to}`;
          }
        }
      } else {
        filters.searchValue = search;
      }
    }
    return filters;
  };

  const handleSearch = (value) => {
    setSearch(value);
  };

  const handleDeleteOrder = (orderId) => {
    setDeleteOrderId(orderId);
    setShowDeleteModal(true);
    setDeleteError(null);
  };

  const confirmDeleteOrder = async () => {
    setDeleteLoading(true);
    setDeleteError(null);
    try {
      await useStore.getState().deleteOrder(deleteOrderId);
      setShowDeleteModal(false);
      toast.success(t("toast.order_deleted_success"));
    } catch (error) {
      setDeleteError(error.message || t("toast.delete_error"));
      console.error("Delete order error:", error);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleBulkDelete = (orderIds) => {
    setShowBulkDeleteModal(true);
    setBulkDeleteError(null);
  };

  const confirmBulkDelete = async () => {
    setBulkDeleteLoading(true);
    setBulkDeleteError(null);
    try {
      await useStore.getState().deleteOrdersBulk(selectedOrders);
      setShowBulkDeleteModal(false);
      setSelectedOrders([]);
      toast.success(t("toast.bulk_delete_success"));
    } catch (error) {
      setBulkDeleteError(error.message || t("toast.bulk_delete_error"));
    } finally {
      setBulkDeleteLoading(false);
    }
  };

  const syncScroll = (source) => {
    if (source === "header" && headerRef.current && bodyRef.current) {
      bodyRef.current.scrollLeft = headerRef.current.scrollLeft;
    } else if (source === "body" && headerRef.current && bodyRef.current) {
      headerRef.current.scrollLeft = bodyRef.current.scrollLeft;
    }
  };

  const handleGoToOrder = (row) => {
    const baseLinks = location.state?.breadcrumbLinks || [];
    const hasOrdersLink = baseLinks.some((link) => link.title === "Orders");

    navigate(`/orders/${row.id}`, {
      state: {
        breadcrumbLinks: [
          ...baseLinks,
          ...(!hasOrdersLink ? [{ title: "Orders", path: "/orders" }] : []),
        ],
      },
    });
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages || ordersLoading) return;
    const filters = buildFilters();
    fetchOrdersPage(newPage, rowsPerPage, { ...filters, sortBy, sort });
  };

  const handleRowsPerPageChange = (newRowsPerPage) => {
    const filters = buildFilters();
    fetchOrdersPage(1, newRowsPerPage, { ...filters, sortBy, sort });
  };

  const generatePaginationNumbers = () => {
    const isSmallScreen =
      typeof window !== "undefined" && window.innerWidth < 640;
    const maxVisiblePages = isSmallScreen ? 2 : 7;
    const pages = [];
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    if (startPage > 1) {
      pages.push(1);
      if (startPage > 2) pages.push("...");
    }
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  // ALL useEffect HOOKS
  useEffect(() => {
    if (statusFilter !== "") {
      const timer = setTimeout(() => {
        const filters = buildFilters();
        fetchOrdersPage(1, rowsPerPage, filters);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [search, statusFilter, rowsPerPage]);

  useEffect(() => {
    if (!orders || orders.length === 0) {
      const filters = buildFilters();
      fetchOrdersPage(1, rowsPerPage, { ...filters, sortBy, sort });
    }
  }, []);

  useEffect(() => {
    if (statusFilter && columnRefs.current[statusFilter]) {
      const colEl = columnRefs.current[statusFilter];
      if (colEl && headerRef.current && bodyRef.current) {
        const left = colEl.offsetLeft - 40;
        headerRef.current.scrollLeft = left;
        bodyRef.current.scrollLeft = left;
      }
    }
  }, [statusFilter]);

  useEffect(() => {
    const filters = buildFilters();
    fetchOrdersPage(1, rowsPerPage, {
      ...filters,
      sortBy,
      sort,
    });
  }, [sortBy, sort]);

  // EARLY RETURN ONLY AFTER ALL HOOKS
  if (ordersError) {
    return (
      <div className="text-red-600 p-4 text-center">
        <p>{t("toast.order_error", { error: ordersError })}</p>
        <button
          onClick={() => fetchOrdersPage(1, rowsPerPage)}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          {t("table.retry")}
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Search and Filter Controls */}

      {/* Option Selector & Filter Controls */}
      <div className="flex flex-col sm:flex-row w-full sm:w-auto mb-2 sm:mb-3 gap-2 sm:gap-4">
        <select
          className={`border ${colors.border} px-2 py-1 sm:px-2 sm:py-2 text-xs sm:text-sm rounded-md outline-transparent focus:outline-sky-700 ${colors.background.primary} ${colors.text.primary} focus:z-10`}
          style={{ minWidth: 90 }}
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setSearch(""); // Reset the search bar when filter type changes
            const filters = {};
            fetchOrdersPage(1, rowsPerPage, filters);
          }}
          disabled={ordersLoading}
        >
          <option value="">{t("table.select")}</option>
          {columns.map((col) => (
            <option key={col} value={col}>
              {t(`table.${col}`)}
            </option>
          ))}
        </select>
        {/* Render input based on filter type, disable if not selected */}
        {statusFilter === "" ? (
          <input
            type="text"
            className={`border ${colors.border} px-2 py-1 sm:px-3 sm:py-2 text-xs sm:text-sm rounded-md w-full sm:w-64 outline-transparent focus:outline-sky-700 ${colors.background.primary} ${colors.text.primary} focus:z-10`}
            placeholder={t("table.search_placeholder")}
            value=""
            disabled
          />
        ) : statusFilter === "status" ? (
          <select
            className={`border ${colors.border} px-2 py-1 sm:px-2 sm:py-2 text-xs sm:text-sm rounded-md w-full sm:w-auto outline-transparent focus:outline-sky-700 ${colors.background.primary} ${colors.text.primary} focus:z-10`}
            style={{ minHeight: "32px" }}
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            disabled={ordersLoading}
          >
            <option value="">{t("table.all")}</option>
            {orderStatuses.map((status) => (
              <option key={status} value={status}>
                {t(
                  `table.statuses.${status}`,
                  status.charAt(0).toUpperCase() + status.slice(1)
                )}
              </option>
            ))}
          </select>
        ) : statusFilter === "order_date" ||
          statusFilter === "completed_date" ||
          statusFilter === "updated_at" ? (
          <div className="flex flex-row gap-1 sm:flex-row sm:gap-2 items-center w-full">
            <div
              className={`flex items-center border rounded-md ${colors.border}`}
            >
              <label
                className="text-xs text-gray-500 m-1 flex-shrink-0"
                htmlFor="from-date"
                style={{ alignSelf: "center" }}
              >
                From
              </label>
              <input
                id="from-date"
                type="date"
                className={`border-none py-1  sm:py-2 text-xs sm:text-sm rounded-md w-full sm:w-32 outline-transparent focus:outline-sky-700 ${colors.background.primary} ${colors.text.primary} focus:z-10`}
                value={search?.from || ""}
                onChange={(e) =>
                  handleSearch({ ...search, from: e.target.value })
                }
                disabled={ordersLoading}
                placeholder="From"
                style={{ verticalAlign: "middle" }}
              />
            </div>
            <div
              className={`flex items-center border rounded-md ${colors.border}`}
            >
              <label
                className="text-xs text-gray-500 m-1 flex-shrink-0"
                htmlFor="to-date"
                style={{ alignSelf: "center" }}
              >
                To
              </label>
              <input
                id="to-date"
                type="date"
                className={`border-none  py-1  sm:py-2 text-xs sm:text-sm rounded-md w-full sm:w-32 outline-transparent focus:outline-sky-700 ${colors.background.primary} ${colors.text.primary} focus:z-10`}
                value={search?.to || ""}
                onChange={(e) =>
                  handleSearch({ ...search, to: e.target.value })
                }
                disabled={ordersLoading}
                placeholder="To"
                style={{ verticalAlign: "middle" }}
              />
            </div>
          </div>
        ) : statusFilter === "total_amount" || statusFilter === "items" ? (
          <div className="flex gap-1 sm:gap-2 w-full">
            <input
              type="number"
              className={`border ${colors.border} px-2 py-1 sm:px-3 sm:py-2 text-xs sm:text-sm rounded-md w-full sm:w-20 outline-transparent focus:outline-sky-700 ${colors.background.primary} ${colors.text.primary} focus:z-10`}
              placeholder="Min"
              value={search?.min || ""}
              onChange={(e) => handleSearch({ ...search, min: e.target.value })}
              disabled={ordersLoading}
              min={0}
            />
            <input
              type="number"
              className={`border ${colors.border} px-2 py-1 sm:px-3 sm:py-2 text-xs sm:text-sm rounded-md w-full sm:w-20 outline-transparent focus:outline-sky-700 ${colors.background.primary} ${colors.text.primary} focus:z-10`}
              placeholder="Max"
              value={search?.max || ""}
              onChange={(e) => handleSearch({ ...search, max: e.target.value })}
              disabled={ordersLoading}
              min={0}
            />
          </div>
        ) : (
          <input
            type="text"
            className={`border ${colors.border} px-2 py-1 sm:px-3 sm:py-2 text-xs sm:text-sm rounded-md w-full sm:w-64 outline-transparent focus:outline-sky-700 ${colors.background.primary} ${colors.text.primary} focus:z-10`}
            placeholder={`Search by ${statusFilter
              .replace(/_/g, " ")
              .replace(/^./, (str) => str.toUpperCase())}...`}
            value={typeof search === "string" ? search : ""}
            onChange={(e) => handleSearch(e.target.value)}
            disabled={ordersLoading}
          />
        )}
      </div>

      {/* Table Container */}
      <div
        className={`relative shadow-lg border ${colors.border} ${colors.background.tertiary} rounded-md overflow-hidden`}
      >
        {/* Header Table */}
        <div
          ref={headerRef}
          className="overflow-x-auto"
          style={{ width: "100%" }}
          onScroll={() => syncScroll("header")}
        >
          <table
            className="w-full text-sm text-left"
            style={{ tableLayout: "fixed", minWidth: "900px" }}
          >
            <colgroup>
              <col className="w-[4px] md:w-[72px]" />
              {columns.map((col) => (
                <col
                  key={col}
                  className={`${columnWidthClasses[col] || " md:w-[110px]"}`}
                />
              ))}
              <col className="w-[6px] md:w-[72px]" />
            </colgroup>
            <thead
              className={`text-xs text-white uppercase ${
                isDark ? "bg-gray-700" : "bg-sky-700"
              }`}
            >
              <tr>
                <th
                  className={` sticky left-0 z-10 shadow-xl text-center ${
                    isDark ? "bg-gray-700" : "bg-sky-700"
                  }`}
                  style={{
                    background: isDark ? "#374151" : "#0369a1",
                  }}
                >
                  <div className="flex flex-col items-center py-1">
                    <button
                      className=" cursor-pointer text-sky-300 hover:text-sky-600"
                      onClick={() => setShowBulkSelect((prev) => !prev)}
                      aria-label="Toggle bulk select"
                      type="button"
                    >
                      {showBulkSelect ? (
                        <TiMinusOutline className="w-5 h-5" />
                      ) : (
                        <TbAugmentedReality className="w-6 h-6" />
                      )}
                    </button>
                    {showBulkSelect && (
                      <input
                        type="checkbox"
                        checked={
                          selectedOrders.length === safeOrders.length &&
                          safeOrders.length > 0
                        }
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedOrders(
                              safeOrders.map((order) => order.id)
                            );
                          } else {
                            setSelectedOrders([]);
                          }
                        }}
                        aria-label="Select all orders"
                      />
                    )}
                  </div>
                </th>
                {columns.map((col) => (
                  <th
                    key={col}
                    ref={(el) => (columnRefs.current[col] = el)}
                    className={`px-2 py-2 text-[11px] sm:px-4 sm:py-3 sm:text-xs cursor-pointer select-none relative 
                     `}
                    onClick={() => {
                      if (sortBy === col) {
                        setSort((prev) => (prev === "asc" ? "desc" : "asc"));
                      } else {
                        setSortBy(col);
                        setSort("asc");
                      }
                      const filters = buildFilters();
                      fetchOrdersPage(1, rowsPerPage, {
                        ...filters,
                        sortBy: col,
                        sort:
                          sortBy === col
                            ? sort === "asc"
                              ? "desc"
                              : "asc"
                            : "asc", // Use 'sort' instead of 'sort'
                      });
                    }}
                    aria-label={`Sort by ${col}`}
                    style={{ userSelect: "none" }}
                  >
                    {/* Show arrow icon for sorted column */}
                    {sortBy === col &&
                      (sort === "asc" ? (
                        <TiArrowSortedUp
                          style={{
                            position: "absolute",
                            top: 6,
                            left: 2,
                            width: 14,
                            height: 14,
                            color: "#fff",
                          }}
                        />
                      ) : (
                        <TiArrowSortedDown
                          style={{
                            position: "absolute",
                            top: 6,
                            left: 2,
                            width: 14,
                            height: 14,
                            color: "#fff",
                          }}
                        />
                      ))}
                    <span className="flex items-center gap-1">
                      {t(
                        `table.${col}`,
                        col
                          .replace(/_/g, " ")
                          .replace(/^./, (str) => str.toUpperCase())
                      )}
                    </span>
                  </th>
                ))}
                <th
                  className={`  text-center sticky right-0 z-10 shadow-xl ${
                    isDark ? "bg-gray-700" : "bg-sky-700"
                  }`}
                  style={{
                    background: isDark ? "#374151" : "#0369a1",
                  }}
                >
                  {showBulkSelect ? (
                    <button
                      onClick={() => handleBulkDelete(selectedOrders)}
                      disabled={
                        selectedOrders.length === 0 ||
                        !safeOrders.some(
                          (order) =>
                            selectedOrders.includes(order.id) &&
                            order.status === "completed"
                        )
                      }
                      aria-label="Bulk Delete Selected Orders"
                      className="inline-flex items-center justify-center w-8 h-8 "
                    >
                      <MdDeleteSweep
                        className={`w-6 h-6 ${
                          selectedOrders.length > 0 &&
                          safeOrders.some(
                            (order) =>
                              selectedOrders.includes(order.id) &&
                              order.status === "completed"
                          )
                            ? "text-red-600"
                            : "text-gray-400"
                        }`}
                      />
                    </button>
                  ) : (
                    <button
                      type="button"
                      className={` text-white-500 hover:text-sky-600 inline-flex items-center cursor-pointer justify-center w-8 h-8`}
                      onClick={() => {
                        setSort((prev) => (prev === "asc" ? "desc" : "asc"));
                        const filters = buildFilters();
                        // fetchOrdersPage(1, rowsPerPage, { ...filters, sort: sort === "asc" ? "desc" : "asc" });
                      }}
                      aria-label={`Sort ${
                        sort === "asc" ? "Descending" : "Ascending"
                      }`}
                      style={{ minWidth: 40, height: 40 }}
                    >
                      {sort === "asc" ? (
                        <PiSortDescendingBold className="w-6 h-6" />
                      ) : (
                        <PiSortAscendingBold className="w-6 h-6" />
                      )}
                    </button>
                  )}
                </th>
              </tr>
            </thead>
          </table>
        </div>

        {/* Body Table */}
        <div
          ref={bodyRef}
          className=""
          style={{ maxHeight: "400px", overflowY: "auto", width: "100%" }}
          onScroll={() => syncScroll("body")}
        >
          <table
            className="w-full text-sm text-left"
            style={{ tableLayout: "fixed", minWidth: "900px" }}
          >
            <colgroup>
              <col className="w-[4px] md:w-[72px]" /> {/* <-- ID column */}
              {columns.map((col) => (
                <col
                  key={col}
                  className={`${
                    columnWidthClasses[col] ||
                    " md:w-[110px] overflow-hidden text-ellipsis whitespace-nowrap"
                  } `}
                />
              ))}
              <col className="w-[6px] md:w-[72px]" />
            </colgroup>
            <tbody>
              {safeOrders.length > 0 ? (
                safeOrders.map((row, idx) => (
                  // Render each order row
                  <tr
                    key={row.id}
                    className={`${colors.background.primary} border-b ${colors.border} h-[28px] cursor-pointer hover:bg-slate-100/40 transition duration-150`}
                  >
                    <td
                      className={`px-0 py-0 sticky left-0 z-10 font-bold text-sky-700 shadow-xl text-xs text-center ${
                        colors.background.secondary
                      } ${
                        !showBulkSelect ? "cursor-pointer hover:underline" : ""
                      }`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {showBulkSelect ? (
                        <input
                          type="checkbox"
                          checked={selectedOrders.includes(row.id)}
                          onChange={(e) => {
                            e.stopPropagation();
                            if (e.target.checked) {
                              setSelectedOrders((prev) => [...prev, row.id]);
                            } else {
                              setSelectedOrders((prev) =>
                                prev.filter((id) => id !== row.id)
                              );
                            }
                          }}
                          aria-label={`Select order ${row.id}`}
                          disabled={row.status !== "completed"}
                        />
                      ) : (
                        (currentPage - 1) * rowsPerPage + idx + 1
                      )}
                    </td>
                    {columns.map((col) => (
                      <td
                        key={col}
                        className={`md:px-2 md:py-0.5 ${colors.text.primary}`}
                        style={
                          col === "items"
                            ? {
                                fontSize: "12px",
                                maxWidth: "180px",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }
                            : col === "total_amount"
                            ? { maxWidth: "90px", whiteSpace: "nowrap" }
                            : {}
                        }
                      >
                        {col === "items" ? (
                          <span className="text-[11px] sm:text-xs font-medium">
                            {row.order_items?.length ?? "0"}
                          </span>
                        ) : col === "total_amount" ? (
                          <span className="text-[11px] sm:text-xs font-semibold text-green-700 dark:text-green-400">
                            ฿{Number(row.total_amount).toFixed(2)}
                          </span>
                        ) : col === "status" ? (
                          <div className="flex items-center">
                            <span
                              className={`px-2 py-0.5 md:px-3 md:py-1 rounded-full text-[11px] sm:text-xs font-medium ${colors.status[orderStatuses.indexOf(row.status)]}`}
                            >
                              {row.status?.charAt(0).toUpperCase() + row.status?.slice(1)}
                            </span>
                          </div>
                        ) : col === "order_date" ? (
                          row.created_at ? (
                            <span className="text-[11px] sm:text-xs">{localTime(row.created_at)}</span>
                          ) : "-"
                        ) : col === "completed_date" ? (
                          row.completed_date ? (
                            <span className="text-[11px] sm:text-xs">{localTime(row.completed_date)}</span>
                          ) : "-"
                        ) : col === "updated_at" ? (
                          row.updated_at ? (
                            <span className="text-[11px] sm:text-xs">{localTime(row.updated_at)}</span>
                          ) : "-"
                        ) : col === "delivery_snapshot" ? (
                                    <>
                          <span className="text-[11px] sm:text-xs md:text-sm">
                            {row.delivery_snapshot?.name || row.delivery_snapshot?.name || "-"}
                          </span>
                          <span className="text-[11px] sm:text-xs md:text-sm">
                            {row.delivery_snapshot?.phone || row.delivery_snapshot?.phone || "-"}
                          </span>
                          </>
                        ) : col === "customer_id" ? (
                          <span className="text-[11px] sm:text-xs">{row.customer_id ?? "-"}</span>
                        ) : (
                          <span className="text-[11px] sm:text-xs">
                            {row[col] ?? ""}
                          </span>
                        )}
                      </td>
                    ))}
                    <td
                      className={` h-[28px]  text-right  sticky right-0 z-10 shadow-xl ${colors.background.secondary}`}
                    >
                      <div className="flex flex-row justify-around">
                        {/* Delete Button */}
                        <button
                          className={`font-medium text-red-600 hover:text-red-800 transition bg-transparent hover:bg-transparent ${
                            row.status !== "completed"
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteOrder(row.id);
                          }}
                          aria-label="Delete Order"
                          disabled={ordersLoading || row.status !== "completed"}
                        >
                          <TiDelete style={{ width: "22px", height: "22px" }} />
                        </button>
                        {/* Quick View Button replaced with Go to Single Order */}
                        <button
                          className="font-medium text-sky-600 hover:text-sky-800 transition bg-transparent hover:bg-transparent"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleGoToOrder(row); // Go to single order page
                          }}
                          aria-label="Go to Single Order"
                          disabled={ordersLoading}
                        >
                          <RiArrowRightDoubleFill
                            style={{ width: "22px", height: "22px" }}
                          />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={columns.length + 2}
                    className={`text-center py-8 ${colors.text.secondary}`}
                  >
                    {ordersLoading ? t("table.loading") : t("table.no_data")}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Controls */}
      {safeOrders.length > 0 && (
        <div className="mt-1.5 md:mt-4 mb-6 flex flex-row justify-between ">
          <div className="flex items-center gap-0.5 ">
            <span className="hidden sm:inline">
              <label className={`text-sm ${colors.text.secondary}`}>
                {t("table.show")}:
              </label>
            </span>
            <select
              className={`border ${colors.border} p-0.5 text-sm rounded-md`}
              value={rowsPerPage}
              onChange={(e) => handleRowsPerPageChange(Number(e.target.value))}
              disabled={ordersLoading}
            >
              {[20, 50, 100].map((count) => (
                <option key={count} value={count}>
                  {count}
                </option>
              ))}
            </select>
            <span className="hidden sm:inline">
              <span className={`text-sm ${colors.text.secondary}`}>
                {t("table.entries")}
              </span>
            </span>
          </div>
          {totalPages > 1 && (
            <div className="flex items-center gap-2">
              {/* Hide left arrow if on first page */}
              {currentPage > 1 && (
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  className={`w-6 h-6 sm:w-7 sm:h-7 rounded-md flex items-center justify-center border ${colors.border} hover:bg-sky-100 text-xs`}
                  aria-label="Previous page"
                  disabled={ordersLoading}
                >
                  <FiChevronLeft className="w-4 h-4" />
                </button>
              )}
              <div className="flex items-center gap-0.5">
                {generatePaginationNumbers().map((page, index) =>
                  page === "..." ? (
                    <span key={`ellipsis-${index}`} className="px-1 text-gray-400">
                      ...
                    </span>
                  ) : (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      disabled={ordersLoading}
                      className={`w-6 h-6 sm:w-7 sm:h-7 rounded-md flex items-center justify-center transition-colors text-xs border ${colors.border} ${
                        currentPage === page
                          ? `${colors.button.primary} font-bold`
                          : "hover:bg-sky-100"
                      }`}
                      aria-current={currentPage === page ? "page" : undefined}
                    >
                      {page}
                    </button>
                  )
                )}
              </div>
              {/* Hide right arrow if on last page */}
              {currentPage < totalPages && (
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  className={`w-6 h-6 sm:w-7 sm:h-7 rounded-md flex items-center justify-center border ${colors.border} hover:bg-sky-100 text-xs`}
                  aria-label="Next page"
                  disabled={ordersLoading}
                >
                  <FiChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Modals */}
      <DeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDeleteOrder}
        itemName={`Order #${deleteOrderId}`}
        itemType="order"
        loading={deleteLoading}
        error={deleteError}
      />
      <WarningModal
        isOpen={showWarningModal}
        onClose={() => setShowWarningModal(false)}
        onConfirm={() => {
          setShowWarningModal(false);
          warningConfirm();
        }}
        message={warningMessage}
        confirmText="Continue"
      />
      <BulkDeleteModal
        isOpen={showBulkDeleteModal}
        onClose={() => setShowBulkDeleteModal(false)}
        onConfirm={confirmBulkDelete}
        itemCount={selectedOrders.length}
        loading={bulkDeleteLoading}
        error={bulkDeleteError}
      />
    </div>
  );
};

export default OrdersTable;
