import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import React, { ChangeEvent } from "react";

type ModalRadioInputProps = {
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  value?: string;
};

export const ModalRadioInput = ({ value, onChange }: ModalRadioInputProps) => {
  return (
    <FormControl sx={{ display: "block", m: 2 }}>
      <FormLabel>Methodology</FormLabel>
      <RadioGroup
        defaultValue="Agile"
        name="methodology"
        value={value}
        onChange={onChange}
      >
        <FormControlLabel value="Agile" control={<Radio />} label="Agile" />
        <FormControlLabel
          value="Waterfall"
          control={<Radio />}
          label="Waterfall"
        />
      </RadioGroup>
    </FormControl>
  );
};
