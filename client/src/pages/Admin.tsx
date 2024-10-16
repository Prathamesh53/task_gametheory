import SelectCom from "@/components/Select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAddCourtMutation, useAddSiteMutation, useLazyFetchLocationsQuery } from "@/redux/slices/api";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const Admin = ()=>{
    const [site, setSite] = useState<string>('');
    const [fetchLocation, { isError, isLoading }] = useLazyFetchLocationsQuery();
    const [Locations, setLocations] = useState<{ _id: string; name: string }[]>([]);
    const [addSites,{isLoading:addSiteLoading}] = useAddSiteMutation();
    const [addCourt,{isLoading:addCourtLoading}] = useAddCourtMutation();
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

      const handleSubmit = async(e:React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        let form = e.target as HTMLFormElement;
        let data = {
            name: (form.elements.namedItem('name') as HTMLInputElement).value,
            location: (form.elements.namedItem('loc') as HTMLInputElement).value
        };
        let res = await addSites(data).unwrap();
        if(res.success){
            toast.success("Site added successfully");
            (form.elements.namedItem('name') as HTMLInputElement).value = '';
            (form.elements.namedItem('loc') as HTMLInputElement).value = '';
            handleLocationFetch();
        }
        else{
            toast.error(res.error);
        }
      }
      const handleSubmitCourt = async(e:React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        let form = e.target as HTMLFormElement;
        let data = {
            siteId:site,
            type: (form.elements.namedItem('type') as HTMLInputElement).value
        };
        let res = await addCourt(data).unwrap();
        console.log(res)
        if(res.success){
            toast.success("Type added successfully"); 
            (form.elements.namedItem('type') as HTMLInputElement).value = '';
            handleLocationFetch();
        }
        else{
            toast.error(res.error);
        }
      }
    return ( 
            <div className="flex flex-wrap w-max">
                <div className="w-1/2 pl-60 mt-20">
                    <h1 className="text-2xl">Add A Site</h1>
                    <form onSubmit={(e)=>handleSubmit(e)} className="max-w-1/3 mt-4">
                        <Input className="my-4" name="name" placeholder="Enter Site Name"/>
                        <Input className="my-4" name="loc"  placeholder="Enter Site Location"/>
                        <Button type="submit" disabled={addSiteLoading} >{addSiteLoading?'Loading...':'Add'}</Button>
                    </form>
                </div>
                <div className="w-1/2 pl-60 mt-20">
                    <h1 className="text-2xl">Add A Court</h1>
                    <form onSubmit={handleSubmitCourt} className="max-w-1/3 mt-4">
                    <SelectCom placeHolder="Select Location" changeFn={setSite} state={[isLoading,isError]} data={Locations}/>
                        <Input className="my-4" name="type"  placeholder="Enter Court Type"/>
                        <Button type="submit" disabled={addCourtLoading}>{addCourtLoading?'Loading...':'Add'}</Button>
                    </form>
                </div>
            </div> 
    )
}

export default Admin;