import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  FiCalendar,
  FiChevronLeft,
  FiChevronRight,
  FiX,
} from "react-icons/fi";


type Props = {
  dateFrom: string;
  dateTo: string;

  onChange: (
    dateFrom: string,
    dateTo: string,
  ) => void;
};


const weekdays = [
  "Sun",
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
];


function parseDateValue(
  value: string,
): Date | null {
  if (!value) {
    return null;
  }

  const parts =
    value.split("-").map(Number);

  if (
    parts.length !== 3 ||
    parts.some(
      (part) =>
        !Number.isInteger(part),
    )
  ) {
    return null;
  }

  const [
    year,
    month,
    day,
  ] = parts;

  const date = new Date(
    year,
    month - 1,
    day,
    12,
  );

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }

  return date;
}


function toDateValue(
  date: Date,
): string {
  const year =
    date.getFullYear();

  const month =
    String(
      date.getMonth() + 1,
    ).padStart(2, "0");

  const day =
    String(
      date.getDate(),
    ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}


function getMonthStart(
  date: Date,
): Date {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    1,
    12,
  );
}


function changeMonth(
  date: Date,
  amount: number,
): Date {
  return new Date(
    date.getFullYear(),
    date.getMonth() + amount,
    1,
    12,
  );
}


function isSameDate(
  first: Date,
  second: Date,
): boolean {
  return (
    first.getFullYear() ===
      second.getFullYear() &&
    first.getMonth() ===
      second.getMonth() &&
    first.getDate() ===
      second.getDate()
  );
}


function getCalendarDays(
  month: Date,
): Date[] {
  const monthStart =
    getMonthStart(month);

  const firstGridDate =
    new Date(
      monthStart.getFullYear(),
      monthStart.getMonth(),
      1 - monthStart.getDay(),
      12,
    );

  return Array.from(
    {
      length: 42,
    },
    (_, index) =>
      new Date(
        firstGridDate.getFullYear(),
        firstGridDate.getMonth(),
        firstGridDate.getDate() +
          index,
        12,
      ),
  );
}


function formatDate(
  value: string,
): string {
  const date =
    parseDateValue(value);

  if (!date) {
    return "";
  }

  return new Intl.DateTimeFormat(
    undefined,
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    },
  ).format(date);
}


export default function DateRangeCalendar({
  dateFrom,
  dateTo,
  onChange,
}: Props) {
  const containerRef =
    useRef<HTMLDivElement>(null);

  const [
    open,
    setOpen,
  ] = useState(false);

  const [
    visibleMonth,
    setVisibleMonth,
  ] = useState(() => {
    return getMonthStart(
      parseDateValue(dateFrom) ??
        new Date(),
    );
  });


  useEffect(() => {
    if (!open) {
      return;
    }

    function handleOutsideClick(
      event: MouseEvent,
    ) {
      const target =
        event.target;

      if (
        target instanceof Node &&
        !containerRef.current?.contains(
          target,
        )
      ) {
        setOpen(false);
      }
    }


    function handleEscape(
      event: KeyboardEvent,
    ) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }


    document.addEventListener(
      "mousedown",
      handleOutsideClick,
    );

    document.addEventListener(
      "keydown",
      handleEscape,
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick,
      );

      document.removeEventListener(
        "keydown",
        handleEscape,
      );
    };
  }, [open]);


  const calendarDays =
    useMemo(
      () =>
        getCalendarDays(
          visibleMonth,
        ),
      [visibleMonth],
    );


  const selectedFrom =
    parseDateValue(dateFrom);

  const selectedTo =
    parseDateValue(dateTo);

  const today = new Date();

  const todayStart =
    new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      12,
    );


  const displayValue =
    dateFrom && dateTo
      ? (
          `${formatDate(dateFrom)} – ` +
          formatDate(dateTo)
        )
      : dateFrom
        ? (
            `${formatDate(dateFrom)} – ` +
            "Select end date"
          )
        : "Select a date range";


  function openCalendar() {
    const anchorDate =
      parseDateValue(dateFrom) ??
      new Date();

    setVisibleMonth(
      getMonthStart(
        anchorDate,
      ),
    );

    setOpen(
      (previous) =>
        !previous,
    );
  }


  function selectDate(
    date: Date,
  ) {
    if (
      date.getTime() >
      todayStart.getTime()
    ) {
      return;
    }

    const selectedValue =
      toDateValue(date);

    if (
      !selectedFrom ||
      selectedTo
    ) {
      onChange(
        selectedValue,
        "",
      );

      return;
    }

    if (
      date.getTime() <
      selectedFrom.getTime()
    ) {
      onChange(
        selectedValue,
        dateFrom,
      );
    } else {
      onChange(
        dateFrom,
        selectedValue,
      );
    }

    setOpen(false);
  }


  function selectToday() {
    const todayValue =
      toDateValue(todayStart);

    onChange(
      todayValue,
      todayValue,
    );

    setVisibleMonth(
      getMonthStart(
        todayStart,
      ),
    );

    setOpen(false);
  }


  function clearRange() {
    onChange("", "");
  }


  return (
    <div
      ref={containerRef}
      className="relative"
    >
      <button
        type="button"
        onClick={openCalendar}
        aria-haspopup="dialog"
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-left text-white outline-none transition hover:border-cyan-500/50 focus:border-cyan-500"
      >
        <span className="flex min-w-0 items-center gap-3">
          <FiCalendar className="h-5 w-5 shrink-0 text-cyan-400" />

          <span
            className={
              dateFrom
                ? "truncate text-sm text-white"
                : "truncate text-sm text-slate-500"
            }
          >
            {displayValue}
          </span>
        </span>

        {(dateFrom || dateTo) && (
          <span
            role="button"
            tabIndex={0}
            aria-label="Clear selected dates"
            onClick={(event) => {
              event.stopPropagation();
              clearRange();
            }}
            onKeyDown={(event) => {
              if (
                event.key === "Enter" ||
                event.key === " "
              ) {
                event.preventDefault();
                event.stopPropagation();
                clearRange();
              }
            }}
            className="rounded-lg p-1 text-slate-500 transition hover:bg-white/10 hover:text-white"
          >
            <FiX className="h-4 w-4" />
          </span>
        )}
      </button>

      <p className="mt-2 text-xs text-slate-500">
        Choose a start date, then
        choose an end date.
      </p>

      {open && (
        <div
          role="dialog"
          aria-label="Choose commit date range"
          className="absolute left-0 top-[calc(100%+0.75rem)] z-50 w-[22rem] max-w-[calc(100vw-3rem)] rounded-2xl border border-white/10 bg-slate-950 p-4 shadow-2xl shadow-black/50"
        >
          <div className="flex items-center justify-between">
            <button
              type="button"
              aria-label="Previous month"
              onClick={() =>
                setVisibleMonth(
                  (current) =>
                    changeMonth(
                      current,
                      -1,
                    ),
                )
              }
              className="rounded-lg border border-white/10 p-2 text-slate-300 transition hover:bg-white/10 hover:text-white"
            >
              <FiChevronLeft className="h-4 w-4" />
            </button>

            <h3 className="font-semibold text-white">
              {
                new Intl.DateTimeFormat(
                  undefined,
                  {
                    month: "long",
                    year: "numeric",
                  },
                ).format(
                  visibleMonth,
                )
              }
            </h3>

            <button
              type="button"
              aria-label="Next month"
              onClick={() =>
                setVisibleMonth(
                  (current) =>
                    changeMonth(
                      current,
                      1,
                    ),
                )
              }
              className="rounded-lg border border-white/10 p-2 text-slate-300 transition hover:bg-white/10 hover:text-white"
            >
              <FiChevronRight className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-4 grid grid-cols-7 gap-1">
            {weekdays.map(
              (weekday) => (
                <div
                  key={weekday}
                  className="py-2 text-center text-xs font-medium text-slate-500"
                >
                  {weekday}
                </div>
              ),
            )}

            {calendarDays.map(
              (date) => {
                const timestamp =
                  date.getTime();

                const outsideMonth =
                  date.getMonth() !==
                  visibleMonth.getMonth();

                const disabled =
                  timestamp >
                  todayStart.getTime();

                const rangeStart =
                  selectedFrom !== null &&
                  isSameDate(
                    date,
                    selectedFrom,
                  );

                const rangeEnd =
                  selectedTo !== null &&
                  isSameDate(
                    date,
                    selectedTo,
                  );

                const insideRange =
                  selectedFrom !== null &&
                  selectedTo !== null &&
                  timestamp >
                    selectedFrom.getTime() &&
                  timestamp <
                    selectedTo.getTime();

                const isToday =
                  isSameDate(
                    date,
                    todayStart,
                  );

                const classes = [
                  "relative flex h-10 items-center justify-center rounded-lg text-sm transition",
                  disabled
                    ? "cursor-not-allowed text-slate-700"
                    : "cursor-pointer hover:bg-white/10",
                  outsideMonth
                    ? "text-slate-600"
                    : "text-slate-300",
                  insideRange
                    ? "bg-cyan-400/10 text-cyan-100"
                    : "",
                  rangeStart ||
                  rangeEnd
                    ? "bg-cyan-400 font-semibold text-slate-950 hover:bg-cyan-300"
                    : "",
                  isToday &&
                  !rangeStart &&
                  !rangeEnd
                    ? "ring-1 ring-inset ring-cyan-400/50 text-cyan-300"
                    : "",
                ]
                  .filter(Boolean)
                  .join(" ");

                return (
                  <button
                    key={
                      toDateValue(date)
                    }
                    type="button"
                    disabled={disabled}
                    aria-label={
                      new Intl.DateTimeFormat(
                        undefined,
                        {
                          dateStyle: "full",
                        },
                      ).format(date)
                    }
                    onClick={() => {
                      if (
                        outsideMonth
                      ) {
                        setVisibleMonth(
                          getMonthStart(
                            date,
                          ),
                        );
                      }

                      selectDate(date);
                    }}
                    className={classes}
                  >
                    {date.getDate()}
                  </button>
                );
              },
            )}
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4">
            <button
              type="button"
              onClick={clearRange}
              disabled={
                !dateFrom &&
                !dateTo
              }
              className="rounded-lg px-3 py-2 text-sm text-slate-400 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
            >
              Clear
            </button>

            <button
              type="button"
              onClick={selectToday}
              className="rounded-lg border border-cyan-400/20 bg-cyan-400/10 px-3 py-2 text-sm font-medium text-cyan-300 transition hover:bg-cyan-400/20"
            >
              Today
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
