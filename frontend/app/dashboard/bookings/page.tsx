"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { cancelBookingThunk, fetchBookings } from "@/redux/slices/bookingSlice";
import { toast } from "sonner";
import { format, isPast } from "date-fns";
import {
  Loader2,
  Calendar,
  Mail,
  User,
  Briefcase,
  XCircle,
  CheckCircle2,
  Clock,
  MoreVertical,
  ExternalLink,
  Search,
  Filter,
  ShieldAlert,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const BookingsPage = () => {
  const dispatch = useAppDispatch();
  const { currentOrgId } = useAppSelector((s) => s.org);
  const { bookings, isLoading } = useAppSelector((s) => s.booking);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (currentOrgId) dispatch(fetchBookings(currentOrgId));
  }, [currentOrgId, dispatch]);

  const filteredBookings = bookings.filter(
    (b) =>
      b.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.service?.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleCancel = async (id: string) => {
    try {
      setCancellingId(id);
      await dispatch(cancelBookingThunk(id)).unwrap();
      toast.success("Booking cancelled");
    } catch {
      toast.error("Could not cancel booking");
    } finally {
      setCancellingId(null);
    }
  };

  if (!currentOrgId)
    return (
      <div className="p-20 text-center font-medium">
        Please select an organization.
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto space-y-10 p-6 pb-20">
      {/* Header & Stats Section */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-1">
          <h1 className="text-5xl font-black tracking-tighter text-slate-900">
            Your Schedule
          </h1>
          <p className="text-slate-500 font-medium text-lg">
            You have {bookings.filter((b) => b.status !== "CANCELLED").length}{" "}
            active appointments.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search clients..."
              className="pl-10 h-12 rounded-2xl border-slate-200 bg-white/50 backdrop-blur-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button
            variant="outline"
            className="h-12 w-12 rounded-2xl border-slate-200 p-0"
          >
            <Filter className="w-5 h-5 text-slate-600" />
          </Button>
        </div>
      </header>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
          <p className="text-slate-400 font-bold animate-pulse">
            Syncing your calendar...
          </p>
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="text-center py-32 bg-slate-50 rounded-[3rem] border-4 border-dashed border-slate-100">
          <div className="bg-white w-20 h-20 rounded-full shadow-xl flex items-center justify-center mx-auto mb-6">
            <Calendar className="w-8 h-8 text-slate-300" />
          </div>
          <h3 className="text-2xl font-bold text-slate-800">
            No bookings found
          </h3>
          <p className="text-slate-500 mt-2 mb-8">
            Try sharing your booking link to get started!
          </p>
          <Button className="rounded-full px-8 h-12 font-bold shadow-lg shadow-primary/20">
            Copy Booking Link
          </Button>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredBookings.map((booking) => {
            const date = new Date(booking.startTime);
            const isBookingPast = isPast(date);
            const isCancelled = booking.status === "CANCELLED";

            return (
              <Card
                key={booking.id}
                className={`group relative overflow-hidden border-none shadow-sm hover:shadow-xl transition-all duration-300 rounded-[2rem] bg-white p-1 ${isCancelled ? "opacity-60" : ""}`}
              >
                <div className="flex flex-col lg:flex-row items-stretch lg:items-center">
                  {/* Date/Time Block (Visual Anchor) */}
                  <div
                    className={`flex flex-row lg:flex-col items-center justify-center p-6 lg:w-40 gap-1 rounded-[1.8rem] transition-colors ${isCancelled ? "bg-slate-100 text-slate-400" : "bg-primary text-primary-foreground"}`}
                  >
                    <span className="text-xs font-black uppercase tracking-widest opacity-80">
                      {format(date, "MMM")}
                    </span>
                    <span className="text-3xl font-black leading-none">
                      {format(date, "dd")}
                    </span>
                    <span className="text-xs font-bold bg-white/20 px-2 py-0.5 rounded-full lg:mt-2">
                      {format(date, "p")}
                    </span>
                  </div>

                  {/* Main Info */}
                  <div className="flex-1 p-6 lg:px-8 space-y-4">
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="text-2xl font-bold tracking-tight text-slate-900 capitalize">
                        {booking.customerName}
                      </h3>
                      <Badge
                        className={`rounded-full px-3 py-1 text-[10px] font-black border-none ${
                          isCancelled
                            ? "bg-slate-200 text-slate-500"
                            : isBookingPast
                              ? "bg-blue-100 text-blue-600"
                              : "bg-green-100 text-green-600"
                        }`}
                      >
                        {isCancelled
                          ? "CANCELLED"
                          : isBookingPast
                            ? "COMPLETED"
                            : "UPCOMING"}
                      </Badge>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-3 text-slate-500 group-hover:text-slate-900 transition-colors">
                        <div className="p-2 bg-slate-50 rounded-lg">
                          <Mail className="w-4 h-4" />
                        </div>
                        {booking.customerEmail}
                      </div>
                      <div className="flex items-center gap-3 text-slate-500 group-hover:text-slate-900 transition-colors">
                        <div className="p-2 bg-slate-50 rounded-lg">
                          <Briefcase className="w-4 h-4" />
                        </div>
                        {booking.service?.title || "Session"}
                      </div>
                    </div>
                  </div>

                  {/* Actions Area */}
                  <div className="p-6 lg:pr-8 flex items-center gap-2">
                    {!isCancelled && !isBookingPast && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            className="h-14 w-14 rounded-2xl text-red-500 hover:text-destructive hover:bg-destructive/5 transition-all cursor-pointer"
                          >
                            {cancellingId === booking.id ? (
                              <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                              <XCircle className="w-6 h-6" />
                            )}
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="rounded-[2.5rem] border-none shadow-2xl p-8">
                          <div className="space-y-6 text-center">
                            <div className="mx-auto w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center">
                              <ShieldAlert className="w-10 h-10 text-destructive animate-bounce" />
                            </div>
                            <AlertDialogHeader>
                              <AlertDialogTitle className="text-3xl font-black tracking-tight">
                                Critical Action
                              </AlertDialogTitle>
                              <AlertDialogDescription className="text-slate-500 text-lg leading-relaxed">
                                You are about to cancel{" "}
                                <span className="font-bold text-slate-900">
                                  {booking.customerName}'s
                                </span>{" "}
                                appointment. <br />
                                <span className="text-destructive font-bold italic">
                                  This cannot be undone.
                                </span>
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter className="flex-col sm:flex-col gap-3">
                              <AlertDialogAction
                                onClick={() => handleCancel(booking.id)}
                                className="h-14 w-full bg-destructive text-white hover:bg-destructive/90 rounded-2xl font-black text-xl shadow-xl shadow-destructive/20"
                              >
                                Cancel Appointment
                              </AlertDialogAction>
                              <AlertDialogCancel className="h-12 w-full border-none font-bold text-slate-400 hover:text-slate-900 hover:bg-transparent">
                                Keep appointment
                              </AlertDialogCancel>
                            </AlertDialogFooter>
                          </div>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default BookingsPage;
