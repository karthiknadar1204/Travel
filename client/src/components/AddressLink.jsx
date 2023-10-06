
const AddressLink = ({children}) => {
  return (
    <div>
              <a
        className="my-2 block font-semibold underline"
        href={"https://maps.google.com/?q=" + children}
      >
        {children}
      </a>
    </div>
  )
}

export default AddressLink