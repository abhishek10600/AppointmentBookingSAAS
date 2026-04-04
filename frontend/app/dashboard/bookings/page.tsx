"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { cancelBookingThunk, fetchBookings } from "@/redux/slices/bookingSlice";
import { useEffect } from "react";
import { toast } from "sonner";
import { Loader2, Calendar, Mail, User, Briefcase } from "lucide-react";

const BookingsPage = () => {
  const dispatch = useAppDispatch();
  const { currentOrgId } = useAppSelector((s) => s.org);
  const { bookings, isLoading } = useAppSelector((s) => s.booking);

  useEffect(() => {
    if (currentOrgId) {
      dispatch(fetchBookings(currentOrgId));
    }
  }, [currentOrgId, dispatch]);

  if (!currentOrgId) {
    return (
      <div className="flex items-center justify-center h-[60vh] text-muted-foreground">
        Select an organization to view bookings
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="animate-spin w-6 h-6" />
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-2">
        <p className="text-lg font-semibold">No bookings yet</p>
        <p className="text-sm text-muted-foreground">
          Your appointments will show up here once customers start booking.
        </p>
      </div>
    );
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return "default";
      case "PENDING":
        return "secondary";
      case "CANCELLED":
        return "destructive";
      default:
        return "outline";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Bookings</h1>
        <p className="text-sm text-muted-foreground">
          Total: {bookings.length}
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {bookings.map((booking) => (
          <Card
            key={booking.id}
            className="rounded-2xl shadow-sm hover:shadow-md transition-all"
          >
            <CardContent className="p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-lg flex items-center gap-2">
                  <User className="w-4 h-4" />
                  {booking.customerName}
                </h2>
                <Badge variant={getStatusVariant(booking.status)}>
                  {booking.status}
                </Badge>
              </div>

              <div className="space-y-2 text-sm text-muted-foreground">
                <p className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  {booking.customerEmail}
                </p>

                <p className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4" />
                  {booking.service?.title}
                </p>

                <p className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {new Date(booking.startTime).toLocaleString()}
                </p>
              </div>

              {booking.status !== "CANCELLED" && (
                <Button
                  variant="destructive"
                  className="w-full cursor-pointer"
                  onClick={async () => {
                    try {
                      await dispatch(cancelBookingThunk(booking.id)).unwrap();
                      toast.success("Booking cancelled successfully");
                    } catch {
                      toast.error("Failed to cancel booking");
                    }
                  }}
                >
                  Cancel Booking
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default BookingsPage;
