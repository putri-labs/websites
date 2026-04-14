"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import { FileText } from "lucide-react";
import { api } from "@/lib/axios";
import { Badge } from "@/components/ui/badge";

type Invoice = {
  id: string;
  invoice_number: string;
  member_id: string | null;
  invoice_type: string;
  subtotal: string;
  gst_amount: string;
  discount_amount: string;
  total_amount: string;
  pdf_url: string | null;
  created_at: string;
};

export default function InvoicesPage() {
  const { data: session } = useSession();
  const token = session?.user?.accessToken;

  const { data: invoices = [], isLoading } = useQuery<Invoice[]>({
    queryKey: ["invoices"],
    queryFn: async () => {
      const res = await api.get("/invoices?limit=100", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    },
    enabled: !!token,
  });

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Invoices</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          {isLoading ? "Loading…" : `${invoices.length} invoice${invoices.length !== 1 ? "s" : ""}`}
        </p>
      </div>

      <div className="rounded-md border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Invoice #</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Type</th>
              <th className="px-4 py-3 text-right font-medium text-muted-foreground">Subtotal</th>
              <th className="px-4 py-3 text-right font-medium text-muted-foreground">GST</th>
              <th className="px-4 py-3 text-right font-medium text-muted-foreground">Total</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Date</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">PDF</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                  Loading invoices…
                </td>
              </tr>
            )}
            {!isLoading && invoices.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                  No invoices yet.
                </td>
              </tr>
            )}
            {invoices.map((inv) => (
              <tr key={inv.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3 font-mono text-xs">
                  <Link
                    href={`/admin/invoices/${inv.id}`}
                    className="font-medium hover:underline text-primary"
                  >
                    {inv.invoice_number}
                  </Link>
                </td>
                <td className="px-4 py-3">
                  <Badge variant="secondary" className="capitalize text-xs">
                    {inv.invoice_type.replace("_", " ")}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-right">₹{parseFloat(inv.subtotal).toFixed(2)}</td>
                <td className="px-4 py-3 text-right text-muted-foreground">
                  ₹{parseFloat(inv.gst_amount).toFixed(2)}
                </td>
                <td className="px-4 py-3 text-right font-semibold">
                  ₹{parseFloat(inv.total_amount).toFixed(2)}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {new Date(inv.created_at).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </td>
                <td className="px-4 py-3">
                  {inv.pdf_url ? (
                    <a
                      href={inv.pdf_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline text-xs flex items-center gap-1"
                    >
                      <FileText className="h-3 w-3" />
                      PDF
                    </a>
                  ) : (
                    <span className="text-muted-foreground text-xs">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
