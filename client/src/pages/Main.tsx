import { useEffect, useState } from "react";
import { useLazyFetchLocationsQuery,useLazyFetchCourtsQuery, useLazyFetchBookingsQuery } from "@/redux/slices/api";
import { toast } from "sonner";
import { DatePicker } from "@/components/datePick";
import SelectCom from "@/components/Select";
import Board from "@/components/Board"; 

const Main = () => {
  const [fetchLocation, { isError, isLoading }] = useLazyFetchLocationsQuery();
  const [fetchCourts, { isError:courtError, isLoading:courtLoading }] = useLazyFetchCourtsQuery();
  const [fetchBookings,{isLoading:bookloading,isError:bookerror}] = useLazyFetchBookingsQuery();

  const [Locations, setLocations] = useState<{ _id: string; name: string }[]>([]);
  const [Courts, setCourts] = useState<{ _id: string; type: string }[]>([]);
  const [bookings,setBookings] = useState<{courtId:string,times:string[]}[]>([]);

  const [site, setSite] = useState<string>('');
  const [court,setCourt] = useState<string>('');
  const [date,setDate] = useState<Date>(); 

  const handleLocationFetch = async () => {
    let res = await fetchLocation({}).unwrap(); 
    if (res.success && res.locations.length) {
      setLocations(res.locations);
      return;
    } else if (res.success && res.locations.length == 0) {
      toast.warning("No Location Found");
      return;
    }
    toast.error(res.error);
  };
  useEffect(() => {
    handleLocationFetch();
  }, []);


  const handleCourtFetch = async()=>{
    let res = await fetchCourts({site_id:site}).unwrap();
    if (res.success && res.courts.length) {
      setCourts(res.courts);
      return;
    } else if (res.success && res.courts.length == 0) {
      toast.warning("No Court Found");
      return;
    }
    toast.error(res.error);
  }
  useEffect(() => {
    if (site!='') {
      setCourts([]);
      setDate(undefined);
      handleCourtFetch();
    }
  }, [site]);


  useEffect(()=>{
    if(site!=''&&court!=''){
      if(!date)
        setDate(new Date()); 
      else
        hanldeBookingFetch();
    }
  },[court])
  const hanldeBookingFetch = async()=>{
    if(date){ 
      let res = await fetchBookings({site_id:site,courtType:court,date:date.toDateString()}).unwrap();
      if(res.success)setBookings(res.bookings); 
    }
  }
  useEffect(()=>{ 
    if(date)
      hanldeBookingFetch();
  },[date])


  return (
    <div className="p-4 dark:bg-gray-800 ">
      <h1 className="text-3xl font-semibold">Schedule</h1>
      <div className="p-4 flex gap-16">
        <div>
          <SelectCom placeHolder="Select Location" changeFn={setSite} state={[isLoading,isError]} data={Locations}/>
        </div>
        <div>
          <SelectCom placeHolder="Select Court" changeFn={setCourt} state={[courtLoading,courtError]} data={Courts}/>
        </div>
        <div>
          {
            Courts.length >0 &&
            <DatePicker date={date} setDate={setDate}/>
          }
        </div>
      </div>
      <div className=" h-[calc(100dvh-200px)]">
        {
        date&&court!=''&&site!=''&&
        <Board data={bookings} state={{isLoading:bookloading,isError:bookerror}} date={date} handleBookingFetch={hanldeBookingFetch}/>
        }
      </div>
    </div>
  );
};

export default Main;
