import BlogLayout from "@/components/layouts/BlogLayout/BlogLayout";
import {
  Button,
  Card,
  Checkbox,
  Input,
  Textarea,
  Typography,
} from "@material-tailwind/react";
import React, { useState } from "react";

export default function Contact() {
  const DEFAULT_VALUES = {
    name: "",
    number: "",
    email: "",
    message: "",
  };
  const [formValues, setFormValues] = useState(structuredClone(DEFAULT_VALUES));

  const handleChange = (e) => {
    setFormValues((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    console.log("formValues", formValues);
    fetch("http://localhost:3001/api/contact", {
      method: "POST",
      headers: {
        Accept: "application.json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formValues),
      cache: "default",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("dd", data);
        alert("form submited");
        setFormValues(structuredClone(DEFAULT_VALUES));
      })
      .catch((err) => console.log("err", err));
  };
  return (
    <>
      <div className="w-full flex justify-center">mnjnjnjn</div>
    </>
  );
}
