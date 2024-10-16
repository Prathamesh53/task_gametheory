import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select";
import React from "react";


const SelectCom = (
    {
        changeFn,
        state:[isLoading,isError],
        data,
        placeHolder
    }:
    {
        changeFn:React.Dispatch<React.SetStateAction<string>>
        state:boolean[],
        data:{[key:string]:string}[],
        placeHolder:string
    })=>{
    const handleChange = (value:string)=>{
        changeFn(value);
    }
    return (
        <div>
            {
                data.length>0&&
                <Select  onValueChange={handleChange}>
                    <SelectTrigger className="dark:bg-gray-900 w-[180px]">
                    <SelectValue placeholder={placeHolder} />
                    </SelectTrigger>
                    <SelectContent>
                    {!isLoading &&
                        !isError &&
                        data.map((l) => (
                            <SelectItem value={l._id?l._id:l.type}>{l.name?l.name:l.type}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            }
            {isLoading ? (
                <div>Loading...</div>
                ) : isError ? (
                    <div>Break During Location Fetch</div>
                ) : (
                    ""
            )}
        </div>
    )
};

export default SelectCom;