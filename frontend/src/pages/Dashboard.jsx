import Header from "../pages/componentes/Dashboard/header";
import Form from "../pages/componentes/Dashboard/form";
import Section from "../pages/componentes/Dashboard/section";

const Dashboard = () => {
    return (
        <>
        <Header />
        <main class="flex-grow flex flex-col items-center justify-start pt-10 pb-20 px-4 sm:px-6">
         <Section />
         <Form />   
        </main>
        </>
     );
}
 
export default Dashboard;