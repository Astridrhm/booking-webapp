'use client'

import { Modal } from '@/components/ui/modal'
import { FormatTime } from '@/utils/time'
import { EventInput } from '@fullcalendar/core/index.js'

interface ModalBookingProps {
  isOpen: boolean;
  closeModal: () => void;
  selectedDate: EventInput[];
  selectedDay: Date | null;
  handleGoToBooking: () => void;
}

export default function ModalBooking({
  isOpen,
  closeModal,
  selectedDate = [],
  selectedDay,
  handleGoToBooking,
}: ModalBookingProps) {

  const getAdjustedTime = (start: Date, end: Date, selectedDay: Date) => {
    const dayStart = new Date(selectedDay);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(selectedDay);
    dayEnd.setHours(23, 59, 59, 999);

    const adjustedStart = start > dayStart ? start : dayStart;
    const adjustedEnd = end < dayEnd ? end : dayEnd;

    return {
      startTime: FormatTime(adjustedStart),
      endTime: FormatTime(adjustedEnd),
    };
  };


  return (
    <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] p-6 lg:p-10">
      <div className="flex flex-col gap-2 px-2 overflow-y-auto custom-scrollbar">
        <div>
          <h5 className="font-semibold text-gray-800 modal-title text-theme-xl dark:text-white/90 lg:text-2xl">
            Booking Room
          </h5>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Jadwal dan Kegiatan <br/>
          </p>
        </div>

        <button
          onClick={handleGoToBooking}
          type="button"
          className="btn btn-success btn-update-event flex w-full justify-center rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600 sm:w-auto"
        >
          Booking Room
        </button>

        <div>
          {selectedDate && selectedDate.length > 0 ? (
            selectedDate.map((data, index) => (
              <div key={data.id ?? index}>
                <div className="flex justify-between items-center border w-full p-3 my-3 rounded-lg bg-gray-100">
                  <div className="grid grid-cols-5 w-full text-sm gap-y-2">
                    <div className="col-span-2 font-medium">Time :</div>
                    <span className="col-span-3">
                      {selectedDay && data.start && data.end ? (
                        (() => {
                          const { startTime, endTime } = getAdjustedTime(
                            data.start as Date,
                            data.end as Date,
                            selectedDay
                          );
                          return (
                            <span className="col-span-3">{startTime} - {endTime}</span>
                          );
                        })()
                      ) : (
                        <span className="col-span-3">-</span>
                      )}
                    </span>

                    <div className="col-span-2 font-medium">Description:</div>
                    <span className="col-span-3">{data.title || '-'}</span>

                    <div className="col-span-2 font-medium">Booked By:</div>
                    <span className="col-span-3">{data.extendedProps?.bookedBy || '-'}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-lg text-muted-foreground text-gray-500 text-center py-4">
              Belum ada booking untuk tanggal ini.
            </p>
          )}
        </div>
      </div>
    </Modal>
  )
}
