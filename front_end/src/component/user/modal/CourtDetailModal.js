import { Dialog } from "@headlessui/react";

export default function CourtDetailModal({
                                             isOpen,
                                             onClose,
                                             selectedCourtId,
                                             availableCourts
                                         }) {
    const court = availableCourts.find(c => c.courtId === selectedCourtId); // ← DÙNG courtId

    if (!court) return null;

    return (
        <Dialog open={isOpen} onClose={onClose} className="relative z-50">
            <div className="fixed inset-0 bg-black/40" />
            <div className="fixed inset-0 flex items-center justify-center p-4">
                <Dialog.Panel className="bg-white rounded-xl p-6 max-w-sm w-full shadow-xl">
                    <Dialog.Title className="text-lg font-bold mb-3">
                        Giờ đã đặt - {court.courtName}
                    </Dialog.Title>

                    <div className="text-sm max-h-64 overflow-y-auto">
                        {court.bookedTimes?.length > 0 ? (
                            court.bookedTimes.map((slot, i) => (
                                <div key={i} className="flex justify-between border-b py-1 text-gray-700">
                                    <span>{slot.startTime.slice(0,5)} - {slot.endTime.slice(0,5)}</span>
                                    <span className="text-red-500 text-xs">Đã đặt</span>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-gray-500 italic py-4">
                                Tất cả khung giờ đều trống
                            </p>
                        )}
                    </div>

                    <button
                        onClick={onClose}
                        className="mt-4 w-full bg-indigo-600 text-white py-2 rounded font-bold hover:bg-indigo-700"
                    >
                        Đóng
                    </button>
                </Dialog.Panel>
            </div>
        </Dialog>
    );
}