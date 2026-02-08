import AuthNavigation from "@/components/AuthNavigation"

const Login = () => {
  return (
    <div className="Login">
        <AuthNavigation />
        <div>
            <section className="max-w-xl mx-auto p-4">
                <div className="text-center mb-12">
                    <h1 className="text-xl mb-2 font-semibold mt-8">Log In</h1>
                    <p className="text-gray-500">Enter your credentials to access your account</p>
                </div>

                <form>
                    <label>
                        EMAIL ADDRESS
                    </label>
                </form>
            </section>
        </div>
    </div>
  )
}

export default Login