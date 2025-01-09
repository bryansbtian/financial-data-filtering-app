import React, { useEffect, useState } from "react";
import { useSortBy, useTable } from "react-table";
import "./index.css";

const App = () => {
  const [financialData, setFinancialData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    revenueMin: "",
    revenueMax: "",
    netIncomeMin: "",
    netIncomeMax: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      const apiKey = "boJpM8LxDwSwO9dxZOEgSi8DzGT9MjHm";
      const apiUrl = `https://financialmodelingprep.com/api/v3/income-statement/AAPL?period=annual&apikey=${apiKey}`;

      try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        setFinancialData(data);
        setFilteredData(data); 
      } catch (error) {
        console.error("Error fetching financial data:", error);
      }
    };

    fetchData();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const resetFilters = () => {
    setFilters({
      startDate: "",
      endDate: "",
      revenueMin: "",
      revenueMax: "",
      netIncomeMin: "",
      netIncomeMax: "",
    });
    setFilteredData(financialData); 
  };

  useEffect(() => {
    let data = [...financialData];

    if (filters.startDate) {
      data = data.filter((item) => item.date >= filters.startDate);
    }
    if (filters.endDate) {
      data = data.filter((item) => item.date <= filters.endDate);
    }
    if (filters.revenueMin) {
      data = data.filter((item) => item.revenue >= Number(filters.revenueMin));
    }
    if (filters.revenueMax) {
      data = data.filter((item) => item.revenue <= Number(filters.revenueMax));
    }
    if (filters.netIncomeMin) {
      data = data.filter(
        (item) => item.netIncome >= Number(filters.netIncomeMin)
      );
    }
    if (filters.netIncomeMax) {
      data = data.filter(
        (item) => item.netIncome <= Number(filters.netIncomeMax)
      );
    }

    setFilteredData(data);
  }, [filters, financialData]);

  const columns = React.useMemo(
    () => [
      {
        Header: "Date",
        accessor: "date",
      },
      {
        Header: "Revenue",
        accessor: "revenue",
        Cell: ({ value }) => `$${value.toLocaleString()}`,
      },
      {
        Header: "Net Income",
        accessor: "netIncome",
        Cell: ({ value }) => `$${value.toLocaleString()}`,
      },
      {
        Header: "Gross Profit",
        accessor: "grossProfit",
        disableSortBy: true,
        Cell: ({ value }) => `$${value.toLocaleString()}`,
      },
      {
        Header: "EPS (Earnings Per Share)",
        accessor: "eps",
        disableSortBy: true,
        Cell: ({ value }) => `$${value}`,
      },
      {
        Header: "Operating Income",
        accessor: "operatingIncome",
        disableSortBy: true,
        Cell: ({ value }) => `$${value.toLocaleString()}`,
      },
    ],
    []
  );

  const tableInstance = useTable(
    {
      columns,
      data: filteredData,
    },
    useSortBy
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = tableInstance;

  return (
    <div className="container mx-auto px-4 py-6 font-sans leading-6 font-normal select-none h-screen overflow-x-auto">
      <h1 className="text-2xl font-bold text-center mb-6">
        AAPL (Apple) Annual Income Statements
      </h1>

      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="flex flex-col gap-4">
          <div>
            <label className="block mb-2">Start Date:</label>
            <input
              type="date"
              name="startDate"
              value={filters.startDate}
              onChange={handleFilterChange}
              className="border p-2 rounded w-full"
            />
          </div>
          <div>
            <label className="block mb-2">End Date:</label>
            <input
              type="date"
              name="endDate"
              value={filters.endDate}
              onChange={handleFilterChange}
              className="border p-2 rounded w-full"
            />
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <label className="block mb-2">Revenue Min:</label>
            <input
              type="number"
              name="revenueMin"
              value={filters.revenueMin}
              onChange={handleFilterChange}
              className="border p-2 rounded w-full"
            />
          </div>
          <div>
            <label className="block mb-2">Revenue Max:</label>
            <input
              type="number"
              name="revenueMax"
              value={filters.revenueMax}
              onChange={handleFilterChange}
              className="border p-2 rounded w-full"
            />
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <label className="block mb-2">Net Income Min:</label>
            <input
              type="number"
              name="netIncomeMin"
              value={filters.netIncomeMin}
              onChange={handleFilterChange}
              className="border p-2 rounded w-full"
            />
          </div>
          <div>
            <label className="block mb-2">Net Income Max:</label>
            <input
              type="number"
              name="netIncomeMax"
              value={filters.netIncomeMax}
              onChange={handleFilterChange}
              className="border p-2 rounded w-full"
            />
          </div>
        </div>
      </div>

      <div className="flex gap-4 justify-center mt-4">
        <button
          onClick={resetFilters}
          className="px-4 py-2 bg-gray-500 text-white rounded"
        >
          Reset Filters
        </button>
      </div>

      <div className="overflow-x-auto mt-6">
        <table
          {...getTableProps()}
          className="table-auto w-full shadow-lg border border-gray-300 rounded-lg"
        >
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr
                {...headerGroup.getHeaderGroupProps()}
                className="bg-gray-100"
              >
                {headerGroup.headers.map((column) => (
                  <th
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    className="p-4 text-center font-semibold bg-black text-white first:rounded-tl-lg last:rounded-tr-lg"
                  >
                    {column.render("Header")}
                    {column.isSorted && (
                      <span>{column.isSortedDesc ? " ↓" : " ↑"}</span>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map((row) => {
              prepareRow(row);
              return (
                <tr
                  {...row.getRowProps()}
                  className="hover:bg-gray-200 border-b last:border-0"
                >
                  {row.cells.map((cell) => (
                    <td
                      {...cell.getCellProps()}
                      className="p-4 text-gray-700 text-center"
                    >
                      {cell.render("Cell")}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default App;
