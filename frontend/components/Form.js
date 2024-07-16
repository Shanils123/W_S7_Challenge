import axios from 'axios';
import React, { useEffect, useState } from 'react';
import * as Yup from "yup";

// 👇 Here are the validation errors you will use with Yup.
const validationErrors = {
  fullNameTooShort: 'Full name must be at least 3 characters',
  fullNameTooLong: 'Full name must be at most 20 characters',
  sizeIncorrect: 'Size must be S or M or L'
}

// 👇 Here you will create your schema.
const formSchema = Yup.object().shape({
  fullName: Yup
    .string()
    .min(3, validationErrors.fullNameTooShort)
    .max(20, validationErrors.fullNameTooLong)
    .required('Full name is required'),
  size: Yup
    .string()
    .oneOf(['S', 'M', 'L'], validationErrors.sizeIncorrect)
    .required('Size is required'),
  toppings: Yup.array().of(Yup.string()),
})

// 👇 This array could help you construct your checkboxes using .map in the JSX.
const toppings = [
  { topping_id: '1', text: 'Pepperoni' },
  { topping_id: '2', text: 'Green Peppers' },
  { topping_id: '3', text: 'Pineapple' },
  { topping_id: '4', text: 'Mushrooms' },
  { topping_id: '5', text: 'Ham' },
]

export default function Form() {
  const initialValues = {
    fullName: '',
    size: '',
    toppings: [],
  }
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})
  const [success, setSuccess] = useState('');
  const [failure, setFailure] = useState(null);
  // const [submitted, setSubmitted] = useState(false)
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    formSchema.isValid(values).then(isValid => {
      setEnabled(isValid)
    })
  }, [values])

  const handleChange = async (evt) => {
    const { name, value, type, checked } = evt.target;
    let newValues = type === 'checkbox' ? checked : value

    if (name === 'fullName') {
      newValues = newValues.trim()
    } 

    setValues((prevState) => ({
      ...prevState, 
      [name]: newValues
    }));

    Yup.reach(formSchema, name)
    .validate(newValues)
    .then(() => {
      setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
    })
    .catch((err) => {
      setErrors((prevErrors) => ({ ...prevErrors, [name]: err.errors[0] }));
    });
  }

  const handleToppingChange = (evt) => {
    const { value, checked } = evt.target;
    let newToppings = [...values.toppings]

    if (checked){
      newToppings = [...newToppings, value]
    } else {
      newToppings = newToppings.filter((topping) => topping !== value)
    }
    setValues({...values, toppings: newToppings})
  }

  const handleSubmit = evt => {
    evt.preventDefault()

    axios.post("http://localhost:9009/api/order", {
      ...values, toppings: Array.from(values.toppings)
    })
    .then((res) => {
      setValues(initialValues)
      setSuccess(res.data.message)
      setFailure(null)
      setEnabled(true)
    })
    .catch((err) => {
      setFailure(err.response.data.message);
      setSuccess('')
      setEnabled(false)
    })
  }

  return (
    <div>
    <h2>Order Your Pizza</h2>
      {success && (
        <div
          style={{
            padding: "10px",
            backgroundColor: "green",
            color: "white",
            fontFamily: "sans-serif",
          }}
        >
          {success}
        </div>
      )}
      {failure && (
        <div>
          <p>
            Thank you for your order, {values.fullName}! Your{" "}
            {values.size} pizza with {values.toppings.length} toppings is
            on the way.
          </p>
          {/*  <p>Error Data: {JSON.stringify(failure.data)}</p> */}
        </div>
      )}

    <form onSubmit={handleSubmit}>

      <div className="input-group">
        <div>
          <label htmlFor="fullName">Full Name</label><br />
          <input
            placeholder="Type full name"
            id="fullName"
            type="text"
            name="fullName"
            value={values.fullName}
            onChange={handleChange}
          />
        </div>
        {errors.fullName && <div className='error'>{errors.fullName}</div>}
      </div>

      <div className="input-group">
        <div>
          <label htmlFor="size">Size</label><br />
          <select
            id="size"
            name="size"
            value={values.size}
            onChange={handleChange}
          >
            <option value="">----Choose Size----</option>
            <option value='S'>Small</option>
            <option value='M'>Medium</option>
            <option value='L'>Large</option>
          </select>
        </div>
        {errors.size && <div className='error'>{errors.size}</div>}
      </div>

      <div className="input-group">
        {toppings.map(topping => (
          <label key={topping.topping_id}>
            <input
              name="toppings"
              type="checkbox"
              value={topping.topping_id}
              checked={values.toppings.includes(topping.topping_id)}
              onChange={handleToppingChange}
            />
            {topping.text}<br />
          </label>
        ))}
      </div>
      <input type="submit" disabled={!enabled} />
    </form>
    </div>
  )
}
