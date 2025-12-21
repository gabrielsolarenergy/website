import React, { useState, useEffect } from "react";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  Loader2,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { serviceAPI } from "@/lib/api";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface CalendarEvent {
  id: string;
  start: Date;
  time: string;
  type: string;
}

const daysOfWeek = ["Lun", "Mar", "Mie", "Joi", "Vin", "Sâm", "Dum"];
const months = [
  "Ianuarie",
  "Februarie",
  "Martie",
  "Aprilie",
  "Mai",
  "Iunie",
  "Iulie",
  "August",
  "Septembrie",
  "Octombrie",
  "Noiembrie",
  "Decembrie",
];

interface UserCalendarViewProps {
  onSelectDate?: (date: Date) => void;
  selectedDate?: Date | null;
}

export const UserCalendarView: React.FC<UserCalendarViewProps> = ({
  onSelectDate,
  selectedDate,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [occupiedSlots, setOccupiedSlots] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOccupiedDates = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await serviceAPI.getMyRequests();
        if (error) throw new Error(error);

        const acceptedEvents = (data || [])
          .filter((req: any) => req.status === "accepted")
          .map((req: any) => {
            const datePart = req.preferred_date.split("T")[0];
            return {
              id: req.id,
              start: new Date(datePart),
              time: req.preferred_time,
              type: req.type,
            };
          });

        setOccupiedSlots(acceptedEvents);
      } catch (err) {
        console.error("Eroare calendar:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOccupiedDates();
  }, []);

  const getMonthDays = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDayOfWeek = (firstDay.getDay() + 6) % 7;

    const days: (Date | null)[] = [];
    for (let i = 0; i < startDayOfWeek; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(new Date(year, month, i));
    return days;
  };

  const getEventsForDate = (date: Date) => {
    return occupiedSlots.filter(
      (slot) =>
        slot.start.getDate() === date.getDate() &&
        slot.start.getMonth() === date.getMonth() &&
        slot.start.getFullYear() === date.getFullYear()
    );
  };

  const navigateMonth = (direction: number) => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + direction, 1)
    );
  };

  const days = getMonthDays(currentDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <TooltipProvider>
      <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-50">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#1a4925]" />
            <span className="font-bold text-slate-900">Disponibilitate</span>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigateMonth(-1)}
              className="rounded-xl"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <span className="text-sm font-black uppercase tracking-widest min-w-[140px] text-center text-slate-700">
              {months[currentDate.getMonth()]} {currentDate.getFullYear()}
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigateMonth(1)}
              className="rounded-xl"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="p-20 flex justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-[#1a4925]" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-7 border-b border-slate-50 bg-slate-50/30">
              {daysOfWeek.map((day) => (
                <div
                  key={day}
                  className="py-4 text-center text-[10px] font-black text-slate-400 uppercase"
                >
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7">
              {days.map((day, index) => {
                const events = day ? getEventsForDate(day) : [];
                const isOccupied = events.length > 0;
                const isPast = day && day < today;
                const isSelected =
                  day &&
                  selectedDate &&
                  day.toISOString().split("T")[0] ===
                    selectedDate.toISOString().split("T")[0];

                return (
                  <div
                    key={index}
                    className={cn(
                      "aspect-square p-0 border-b border-r border-slate-50 last:border-r-0 flex items-center justify-center transition-all relative",
                      isPast && "bg-slate-50/30 opacity-40",
                      isSelected && "bg-[#1a4925]/5"
                    )}
                  >
                    {day && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            type="button"
                            disabled={isPast}
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectDate?.(day);
                            }}
                            className={cn(
                              "w-full h-full flex flex-col items-center justify-center text-sm font-bold relative transition-colors",
                              !isPast && "hover:bg-slate-50 cursor-pointer",
                              isOccupied && !isPast
                                ? "text-[#1a4925]"
                                : "text-slate-700",
                              isPast && "text-slate-300 cursor-not-allowed",
                              isSelected &&
                                "ring-2 ring-inset ring-[#1a4925] rounded-none"
                            )}
                          >
                            {day.getDate()}
                            {isOccupied && !isPast && (
                              <div className="absolute bottom-2 w-1 h-1 rounded-full bg-[#1a4925]" />
                            )}
                          </button>
                        </TooltipTrigger>
                        {isOccupied && (
                          <TooltipContent className="bg-white border-slate-100 shadow-xl p-3 rounded-2xl">
                            <div className="space-y-2">
                              <p className="text-[10px] font-black uppercase text-slate-400">
                                Intervale Ocupate
                              </p>
                              {events.map((ev) => (
                                <div
                                  key={ev.id}
                                  className="flex items-center gap-2 text-[#1a4925]"
                                >
                                  <Clock className="w-3 h-3" />
                                  <span className="text-xs font-bold">
                                    {ev.time}
                                  </span>
                                  <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded-full">
                                    {ev.type}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </TooltipContent>
                        )}
                      </Tooltip>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </TooltipProvider>
  );
};
