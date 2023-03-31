import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

import { Entry } from "../../../../server/types";

type ModalDateInputProps = {
  setValue: (value: React.SetStateAction<Entry>) => void;
  value?: string;
};

export const ModalDateInput = ({ setValue, value }: ModalDateInputProps) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        label="Start Date"
        value={dayjs(value)}
        onChange={(v) => {
          setValue((prev) => ({
            ...prev,
            startDate:
              v?.format("YYYY/MM/DD") ?? dayjs(new Date()).format("YYYY/MM/DD"),
          }));
        }}
        sx={{ display: "block", m: 2 }}
      />
    </LocalizationProvider>
  );
};
