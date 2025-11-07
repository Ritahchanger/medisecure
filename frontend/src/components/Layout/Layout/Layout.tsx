import BackButton from "../BackButton/BackButton";
import Navbar from "../Navbar/Navbar";
const Layout = ({ children }: any) => {
  return (
    <div className="">
      <Navbar />
      <main className="pt-[50px] py-6 px-4">{children}</main>
      <BackButton />
    </div>
  );
};

export default Layout;
