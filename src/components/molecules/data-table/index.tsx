import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/atoms/table";

type DataWithOptionalKey<T> = T & { action?: JSX.Element };

export interface ColumnsDef<T> {
  field: keyof T | "action";
  label: string;
  className?: string;
  cellRenderer?: (
    value: T[keyof T] | JSX.Element | undefined,
    row: DataWithOptionalKey<T>
  ) => React.ReactNode;
}

interface DataTableProps<T> {
  loading: boolean;
  emptyText?: string;
  className?: string;
  columns: ColumnsDef<T>[];
  data: DataWithOptionalKey<T>[];
  onRow?: (row: DataWithOptionalKey<T>) => void;
}

const DataTable = <T,>({
  columns,
  data,
  className = "",
  emptyText = "No results",
  onRow,
}: DataTableProps<T>) => {
  return (
    <div className={`w-full ${className}`}>
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column, index) => (
              <TableHead key={index} className={column.className}>
                {column.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center">
                {emptyText}
              </TableCell>
            </TableRow>
          ) : (
            data.map((row, rowIndex) => (
              <TableRow
                key={rowIndex}
                onClick={() => onRow?.(row)}
                className={onRow ? "cursor-pointer hover:bg-slate-100" : ""}
              >
                {columns.map((column, colIndex) => {
                  const cellValue =
                    column.field === "action"
                      ? row.action
                      : row[column.field as keyof T];

                  return (
                    <TableCell
                      key={`${rowIndex}-${colIndex}`}
                      className={column.className}
                    >
                      {column.cellRenderer ? (
                        column.cellRenderer(
                          cellValue as T[keyof T] | JSX.Element | undefined,
                          row
                        )
                      ) : React.isValidElement(cellValue) ? (
                        cellValue
                      ) : (
                        <span>{String(cellValue)}</span>
                      )}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default DataTable;
