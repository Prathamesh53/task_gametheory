import { toast } from "sonner";
import Loader from "./Loader/Loader";
import { useBookCourtMutation } from "@/redux/slices/api";

const Board = ({
  data,
  state,
  date,
  handleBookingFetch
}: {
  data: { courtId: string; times: string[] }[];
  state: { isLoading: boolean; isError: boolean };
  date:Date|undefined,
  handleBookingFetch:() => Promise<void>
}) => {
  const [bookCourt] = useBookCourtMutation();
  const handleBooking = async(time: string, courtId: string, booked: boolean) => {
    if (booked) {
      toast.warning("Already Booked Time");
      return;
    }
    if(!date){
        toast.warning("Select a Date First");
        return;
    }
    let res = await bookCourt({
        time,
        courtId,
        date
    }).unwrap();
    if(res.success){
        toast.success("Booking Successfull");
        handleBookingFetch();
    }
    else toast.error(res.error)
  };
  return (
    
    <div className="w-full h-full flex min-h-96 overflow-y-auto">
      {(date && !state.isLoading && !state.isError && data.length > 0 ) ? (
        <>
          <div className="mt-8">
            {time.map((t) => {
              return <div className="h-24 m-1 w-24 border-black">{t}</div>;
            })}
          </div>
          <div className="flex overflow-x-auto h-max">
            {data.map((d, i) => {
              return (
                <div>
                  <div key={"bout-"+i} className="w-44 pb-2 text-center">Court-{i + 1}</div>
                  {time.map((t,j) => {
                    return (
                      <div key={"bin-"+j}
                   onClick={() => {
                          handleBooking(t, d.courtId, d.times.includes(t));
                        }}
                        className={
                          "h-24 m-1 cursor-pointer hover:scale-105 transition-all rounded w-44 border-2 border-gray-300 dark:border-gray-600 dark:text-gray-200 p-2 " +
                          (d.times.includes(t) ? "bg-green-300 dark:bg-green-900" : "")
                        }
                      >
                        {d.times.includes(t) ? "Booked" : ""}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </>
      ) : state.isLoading ? (
        <Loader />
      ) : state.isError ? (
        "Error During Loading Bookings"
      ) : (
        "No Data Found!"
      )}
    </div> 
  );
};

export default Board;

const time = [
    "4 AM",
    "5 AM",
    "6 AM",
    "7 AM",
    "8 AM",
    "9 AM",
    "10 AM",
    "11 AM",
    "12 PM",
    "1 PM",
    "2 PM",
    "3 PM",
    "4 PM",
    "5 PM",
    "6 PM",
    "7 PM",
    "8 PM",
    "9 PM",
    "10 PM",
  ];