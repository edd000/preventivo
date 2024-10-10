import React from 'react'

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
}

export const Select: React.FC<SelectProps> = ({ label, children, className = '', ...props }) => {
  return (
    <div className="mb-4">
      {label && (
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={props.id}>
          {label}
        </label>
      )}
      <select
        className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${className}`}
        {...props}
      >
        {children}
      </select>
    </div>
  )
}