import { Link } from "react-router"

function ErrorPage(){
    return(
        <div>
            <h1>Sorry, This URL doesn't Exist.</h1>
            <Link to="/">You can click here to go Home Page.</Link>
        </div>
    )
}
export default ErrorPage;