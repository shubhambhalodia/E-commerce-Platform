import React from "react";
import Layout from "../../components/layout/Layout";
import UserMenu from "../../components/layout/UserMenu";
import { useAuth } from "../../context/auth";
import avatarPlaceholder from "../../images/avatar.jfif"; // Import a placeholder image for the user avatar

const Dashboard = () => {
  const [auth] = useAuth();

  return (
    <Layout title={"Dashboard - Ecommerce App"}>
      <div className="container-fluid m-3 p-3">
        <div className="row">
          <div className="col-md-3">
            <UserMenu />
          </div>
          <div className="col-md-9">
            <div className="card p-3">
              <div className="d-flex align-items-center mb-3">
                <img
                  src={avatarPlaceholder}
                  alt="User Avatar"
                  className="avatar mr-3"
                />
                <div>
                  <h3 className="mb-0">{auth?.user?.name}</h3>
                  <p className="text-muted">{auth?.user?.email}</p>
                </div>
              </div>
              <div>
                <h5 className="mb-3">Address</h5>
                <p>{auth?.user?.address}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
