'use client'

import { Modal } from '@/components/ui/modal'
import { formatTime, getSelectedDate } from '@/utils/time'
import { EventInput } from '@fullcalendar/core/index.js'

interface ModalBookingProps {
  isOpen: boolean;
  closeModal: () => void;
  selectedDate: EventInput[];
  selectedDay: Date | null;
  roomLabel: string;
  handleGoToBooking: () => void;
}

export default function ModalBooking({
  isOpen,
  closeModal,
  selectedDate = [],
  selectedDay,
  roomLabel,
  handleGoToBooking,
}: ModalBookingProps) {

  const getAdjustedTime = (start: Date, end: Date, selectedDay: Date) => {
    const dayStart = new Date(selectedDay)
    dayStart.setHours(0, 0, 0, 0)
    const dayEnd = new Date(selectedDay)
    dayEnd.setHours(23, 59, 59, 999)

    const adjustedStart = start > dayStart ? start : dayStart
    const adjustedEnd = end < dayEnd ? end : dayEnd

    return {
      startTime: formatTime(adjustedStart),
      endTime: formatTime(adjustedEnd),
    }
  }

  const disableButtonBooking = ():boolean => {
    if(!selectedDay) return false

    const dateNow = getSelectedDate(new Date())
    const dateSelect = getSelectedDate(new Date(selectedDay))

    if(dateNow > dateSelect) {
      return true
    }

    return false
  }

  const isDisabled = disableButtonBooking()

  return (
    <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] max-h-[90%] p-6 lg:p-10 overflow-hidden">
      <div className="flex flex-col gap-2 px-2 h-screen">
        {/* <div>
          <h5 className="font-semibold text-gray-800 modal-title text-theme-xl dark:text-white/90 lg:text-2xl">
            Booking Room
          </h5>
        </div> */}

        <div className='flex justify-between mr-8'>
          <p className="text-xl text-black-300 font-bold dark:text-gray-400">
            {roomLabel} <br/>
          </p>
          <p className="text-lg text-black-300 font-bold dark:text-gray-400">
            Date : {getSelectedDate(new Date(selectedDay!))} <br/>
          </p>
        </div>

        <button
          onClick={handleGoToBooking}
          type="button"
          disabled={isDisabled}
          className={`btn btn-success btn-update-event flex w-full justify-center rounded-lg px-4 py-2.5 text-sm font-medium text-white sm:w-auto ${isDisabled
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-brand-500 cursor-pointer hover:bg-brand-600"}`
            }>
          Booking Room
        </button>

        <div className="overflow-y-auto mt-4 max-h-[70%] md:max-h-[73%] ">
          {selectedDate && selectedDate.length > 0 ? (
            selectedDate.map((data, index) => (
              <div key={data.id ?? index}>
                <div className="flex justify-between items-center border w-full p-3 my-3 rounded-lg bg-gray-50">
                  <div className="grid grid-cols-4 w-full text-sm gap-y-2">
                    <div className="col-span-1 font-medium">Time </div>
                    <span className="col-span-3">
                      {selectedDay && data.start && data.end ? (
                        (() => {
                          const { startTime, endTime } = getAdjustedTime(
                            data.start as Date,
                            data.end as Date,
                            selectedDay
                          );
                          return (
                            <span className="col-span-3">: {startTime} - {endTime}</span>
                          );
                        })()
                      ) : (
                        <span className="col-span-3">-</span>
                      )}
                    </span>

                    <div className="col-span-1 font-medium">Title</div>
                    <span className="col-span-3">: {data.title || '-'}</span>

                    <div className="col-span-1 font-medium">Descriptions</div>
                    <span className="col-span-3">: {data.extendedProps?.description || '-'}</span>

                    <div className="col-span-1 font-medium">Booked By</div>
                    <span className="col-span-3">: {data.extendedProps?.bookedBy || '-'}</span>
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
