import { FormProvider, useForm } from "react-hook-form";
import DetailsSection from "./DetailsSection";
import TypeSection from "./TypeSection";

export type HotelFormData = {
  name: string;
  city: string;
  country: string;
  description: string;
  type: string;
  adultCount: number;
  childCount: number;
  facilities: string[];
  pricePerNight: number;
  starRating: number;
  imageFiles: FileList;
};

const ManageHotelForm = () => {
  const formMethods = useForm<HotelFormData>();
  //we will break our form into smaller components, so for this we will use form provider, so that our child react component get access to all the react hook form methods
  return (
    <FormProvider {...formMethods}>
      <form>
        <DetailsSection />
        <TypeSection />
      </form>
    </FormProvider>
  );
};

export default ManageHotelForm;
