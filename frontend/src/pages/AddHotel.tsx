import { useMutation } from "react-query";
import ManageHotelForm from "../forms/ManageHotelForm/ManageHotelForm";
import * as appiClient from "../api-clients";
import { useAppContext } from "../contexts/AppContext";

const AddHotel = () => {
  const { showToast } = useAppContext();
  const { mutate, isLoading } = useMutation(appiClient.addHotel, {
    onSuccess: async () => {
      showToast({
        message: "Operation Performed Successfully",
        type: "SUCCESS",
      });
    },
    onError: (error: Error) => {
      showToast({ message: error.message, type: "ERROR" });
    },
  });

  const handleSubmit = (hotelFormData: FormData) => {
    mutate(hotelFormData);
  };
  return <ManageHotelForm onSave={handleSubmit} isLoading={isLoading} />;
};
export default AddHotel;
