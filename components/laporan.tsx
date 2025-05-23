"use client";

import React from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/table";
import { Chip } from "@heroui/chip";
import { Tooltip } from "@heroui/tooltip";

import { EyeIcon, EditIcon, DeleteIcon } from "@/components/icons";
import DetailModal from "@/components/detailModal";

const columns = [
  {
    key: "perihal",
    label: "Perihal",
  },
  {
    key: "pelapor",
    label: "Pelapor",
  },
  {
    key: "status",
    label: "Status",
  },
  {
    key: "actions",
    label: "Tindakan",
  },
];

const statusColorMap: Record<
  "selesai" | "aktif" | "vacation",
  "success" | "danger" | "warning"
> = {
  selesai: "success",
  aktif: "danger",
  vacation: "warning",
};

export default function Laporan() {
  const [rows, setRows] = React.useState<any[]>([]);
  const [selectedRow, setSelectedRow] = React.useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  React.useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/laporan");
        const data = await res.json();

        setRows(data);
      } catch (err) {
        console.error("Error fetching laporan:", err);
      }
    }

    fetchData();
  }, []);

  const openModal = (row: any) => {
    setSelectedRow(row);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedRow(null);
  };

  const renderCell = React.useCallback(
    (laporan: { [x: string]: any }, columnKey: string | number) => {
      const cellValue = laporan[columnKey];

      switch (columnKey) {
        case "perihal":
          return (
            <div className="flex flex-col">
              <p className="text-sm">{cellValue}</p>
            </div>
          );
        case "pelapor":
          return (
            <div className="flex flex-col">
              <p className="text-sm">{cellValue}</p>
            </div>
          );
        case "status":
          const status = cellValue as string;
          const color =
            statusColorMap[status as keyof typeof statusColorMap] ?? "default";

          return (
            <Chip color={color} size="sm" variant="flat">
              {cellValue}
            </Chip>
          );
        case "actions":
          return (
            <div className="relative flex items-center gap-2">
              <Tooltip content="Detail">
                <span
                  className="text-lg text-default-400 cursor-pointer active:opacity-50"
                  role="button"
                  tabIndex={0}
                  onClick={() => openModal(laporan)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      openModal(laporan);
                    }
                  }}
                >
                  <EyeIcon />
                </span>
              </Tooltip>
              <Tooltip content="Ubah">
                <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                  <EditIcon />
                </span>
              </Tooltip>
              <Tooltip color="danger" content="Hapus">
                <span className="text-lg text-danger cursor-pointer active:opacity-50">
                  <DeleteIcon />
                </span>
              </Tooltip>
            </div>
          );
        default:
          return cellValue;
      }
    },
    [],
  );

  return (
    <div>
      <Table aria-label="Tabel data laporan">
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn
              key={column.key}
              align={column.key === "actions" ? "center" : "start"}
              className="whitespace-nowrap text-xs sm:text-sm"
            >
              {column.label}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody emptyContent={"Tidak ada data ditampilkan"} items={rows}>
          {(item) => (
            <TableRow key={item.key}>
              {(columnKey) => (
                <TableCell className="text-xs sm:text-xs max-w-[200px] truncate sm:whitespace-normal">
                  {renderCell(item, columnKey)}
                </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
      <DetailModal
        data={selectedRow}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </div>
  );
}
