import Agent from "@/components/Agent"

const page = () => {
  return (
    <>
        <h3>Interview Generation</h3>
        <Agent userName="John Doe" type="generate" userId="12345" />
    </>
  )
}

export default page