"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Download, ArrowLeft, Loader2 } from "lucide-react";
import { api } from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

type Invoice = {
  id: string;
  invoice_number: string;
  member_id: string | null;
  invoice_type: string;
  subtotal: string;
  gst_pct: string;
  gst_amount: string;
  discount_amount: string;
  total_amount: string;
  pdf_url: string | null;
  created_at: string;
};

function fmt(val: string) {
  return `₹${parseFloat(val).toFixed(2)}`;
}

export default function InvoiceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: session } = useSession();
  const token = session?.user?.accessToken;
  const qc = useQueryClient();
  const [pdfError, setPdfError] = useState<string | null>(null);

  const { data: invoice, isLoading } = useQuery<Invoice>({
    queryKey: ["invoice", id],
    queryFn: async () => {
      const res = await api.get(`/invoices/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    },
    enabled: !!id && !!token,
  });

  const generatePdf = useMutation({
    mutationFn: async () => {
      const res = await api.post(
        `/invoices/${id}/pdf`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data as { pdf_url: string };
    },
    onSuccess: (data) => {
      // Open PDF in new tab
      window.open(data.pdf_url, "_blank", "noopener,noreferrer");
      // Refresh invoice to cache the pdf_url
      qc.invalidateQueries({ queryKey: ["invoice", id] });
      qc.invalidateQueries({ queryKey: ["invoices"] });
    },
    onError: () => {
      setPdfError("Failed to generate PDF. Please try again.");
    },
  });

  const handleDownload = () => {
    setPdfError(null);
    if (invoice?.pdf_url) {
      window.open(invoice.pdf_url, "_blank", "noopener,noreferrer");
    } else {
      generatePdf.mutate();
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="py-12 text-center text-muted-foreground">
        Invoice not found.
      </div>
    );
  }

  const discount = parseFloat(invoice.discount_amount);
  const gstPct = parseFloat(invoice.gst_pct);

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              {invoice.invoice_number}
            </h1>
            <p className="text-muted-foreground text-sm capitalize mt-0.5">
              {invoice.invoice_type.replace("_", " ")} ·{" "}
              {new Date(invoice.created_at).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
        </div>
        <Button onClick={handleDownload} disabled={generatePdf.isPending}>
          {generatePdf.isPending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Download className="mr-2 h-4 w-4" />
          )}
          {invoice.pdf_url ? "Open PDF" : "Download PDF"}
        </Button>
      </div>

      {pdfError && (
        <p className="text-destructive text-sm">{pdfError}</p>
      )}

      {/* Invoice preview card */}
      <div className="rounded-xl border bg-card shadow-sm p-6 space-y-6">
        {/* Invoice header */}
        <div className="flex items-start justify-between">
          <div>
            <p className="text-lg font-semibold">Tax Invoice</p>
            <p className="text-muted-foreground text-sm font-mono">
              {invoice.invoice_number}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Date</p>
            <p className="text-sm font-medium">
              {new Date(invoice.created_at).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </p>
          </div>
        </div>

        <Separator />

        {/* Line items */}
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground capitalize">
              {invoice.invoice_type.replace("_", " ")}
            </span>
            <span>{fmt(invoice.subtotal)}</span>
          </div>

          {gstPct > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                GST ({gstPct.toFixed(0)}%)
              </span>
              <span>{fmt(invoice.gst_amount)}</span>
            </div>
          )}

          {discount > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Discount</span>
              <span className="text-green-600">− {fmt(invoice.discount_amount)}</span>
            </div>
          )}
        </div>

        <Separator />

        {/* Total */}
        <div className="flex justify-between items-center">
          <span className="font-semibold text-base">Total</span>
          <span className="font-bold text-xl">
            {fmt(invoice.total_amount)}
          </span>
        </div>

        {/* Footer note */}
        <p className="text-xs text-muted-foreground text-center pt-2">
          This is a computer-generated invoice.
        </p>
      </div>
    </div>
  );
}
