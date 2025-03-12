import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { BsSearch } from "react-icons/bs";
import { TailSpin } from "react-loader-spinner";
import Header from "../Header";
import FilterGroup from "../FiltersGroup";
import JobCard from "../JobCard";
import "./index.css";

const Locations = [
  { label: "Delhi", employmentTypeId: "DELHI" },
  { label: "Hyderabad", employmentTypeId: "HYDERABAD" },
];

const employmentTypesList = [
  { label: "Full Time", employmentTypeId: "FULLTIME" },
  { label: "Freelance", employmentTypeId: "FREELANCE" },
  { label: "Part Time", employmentTypeId: "PARTTIME" },
  { label: "Internship", employmentTypeId: "INTERNSHIP" },
];

const salaryRangesList = [
  { salaryRangeId: "1000000", label: "10 LPA and above" },
  { salaryRangeId: "2000000", label: "20 LPA and above" },
  { salaryRangeId: "3000000", label: "30 LPA and above" },
  { salaryRangeId: "4000000", label: "40 LPA and above" },
];

const apiStatusConstants = {
  initial: "INITIAL",
  success: "SUCCESS",
  failure: "FAILURE",
  inProgress: "IN_PROGRESS",
};

const Jobs = () => {
  const [jobsList, setJobsList] = useState([]);
  const [apiStatus, setApiStatus] = useState(apiStatusConstants.initial);
  const [employeeTypeList, setEmployeeTypeList] = useState([]);
  const [locationList, setLocationList] = useState([]);
  const [minimumSalary, setMinimumSalary] = useState("");
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    getJobsData();
  }, []);

  const getJobsData = async () => {
    setApiStatus(apiStatusConstants.inProgress);

    const apiUrl = `https://apis.ccbp.in/jobs?employment_type=${employeeTypeList.join(
      ","
    )}&location=${locationList.join(
      ","
    )}&minimum_package=${minimumSalary}&search=${searchInput}`;

    const jwtToken = Cookies.get("jwt_token");
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: "GET",
    };

    try {
      const response = await fetch(apiUrl, options);
      if (response.ok) {
        const data = await response.json();
        const updatedJobsData = data.jobs.map((eachJob) => ({
          companyLogoUrl: eachJob.company_logo_url,
          employmentType: eachJob.employment_type,
          id: eachJob.id,
          jobDescription: eachJob.job_description,
          packagePerAnnum: eachJob.package_per_annum,
          rating: eachJob.rating,
          title: eachJob.title,
          location: eachJob.location,
        }));
        setJobsList(updatedJobsData);
        setApiStatus(apiStatusConstants.success);
      } else {
        setApiStatus(apiStatusConstants.failure);
      }
    } catch (error) {
      setApiStatus(apiStatusConstants.failure);
    }
  };

  const renderJobsList = () => {
    const renderJobsList = jobsList.length > 0;

    return renderJobsList ? (
      <div className="all-jobs-container">
        <ul className="jobs-list">
          {jobsList.map((job) => (
            <JobCard jobData={job} key={job.id} />
          ))}
        </ul>
      </div>
    ) : (
      <div className="no-jobs-view">
        <img
          src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
          className="no-jobs-img"
          alt="no jobs"
        />
        <h1 className="no-jobs-heading">No Jobs Found</h1>
        <p className="no-jobs-description">
          We could not find any jobs. Try other filters.
        </p>
      </div>
    );
  };

  const renderFailureView = () => (
    <div className="jobs-error-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="jobs-failure-img"
      />
      <h1 className="jobs-failure-heading-text">Oops! Something Went Wrong</h1>
      <p className="jobs-failure-description">
        We cannot seem to find the page you are looking for
      </p>
      <button
        type="button"
        data-testid="button"
        className="jobs-failure-button"
        onClick={getJobsData}
      >
        Retry
      </button>
    </div>
  );

  const renderLoadingView = () => (
    <div className="loader-container" data-testid="loader">
      <TailSpin
        height="50"
        width="50"
        color="#ffffff"
        ariaLabel="tail-spin-loading"
        radius="1"
        visible={true}
      />
    </div>
  );

  const renderAllJobs = () => {
    switch (apiStatus) {
      case apiStatusConstants.success:
        return renderJobsList();
      case apiStatusConstants.failure:
        return renderFailureView();
      case apiStatusConstants.inProgress:
        return renderLoadingView();
      default:
        return null;
    }
  };

  const changeSalary = (salaryRangeId) => {
    setMinimumSalary(salaryRangeId);
    getJobsData();
  };

  const changeEmployeeList = (type) => {
    const inputNotInList = employeeTypeList.includes(type);

    if (!inputNotInList) {
      setEmployeeTypeList((prev) => [...prev, type]);
      getJobsData();
    } else {
      const filteredData = employeeTypeList.filter(
        (eachItem) => eachItem !== type
      );
      setEmployeeTypeList(filteredData);
      getJobsData();
    }
  };

  const changeLocationList = (type) => {
    const inputNotInList = locationList.includes(type);

    if (!inputNotInList) {
      setLocationList((prev) => [...prev, type]);
      getJobsData();
    } else {
      const filteredData = locationList.filter((eachItem) => eachItem !== type);
      setLocationList(filteredData);
      getJobsData();
    }
  };

  const changeSearchInput = (event) => {
    setSearchInput(event.target.value);
  };

  const onEnterSearchInput = (event) => {
    if (event.key === "Enter") {
      getJobsData();
    }
  };

  return (
    <>
      <Header />
      <div className="jobs-container">
        <div className="jobs-content">
          <FilterGroup
            employmentTypesList={employmentTypesList}
            locationsList={Locations}
            salaryRangesList={salaryRangesList}
            changeSearchInput={changeSearchInput}
            searchInput={searchInput}
            getJobs={getJobsData}
            changeSalary={changeSalary}
            changeEmployeeList={changeEmployeeList}
            changeLocationList={changeLocationList}
          />
          <div className="search-input-jobs-list-container">
            <div className="search-input-container-desktop">
              <input
                type="search"
                className="search-input-desktop"
                placeholder="Search"
                value={searchInput}
                onChange={changeSearchInput}
                onKeyDown={onEnterSearchInput}
              />
              <button
                type="button"
                data-testid="searchButton"
                className="search-button-container-desktop"
                onClick={getJobsData}
              >
                <BsSearch className="search-icon-desktop" />
              </button>
            </div>
            {renderAllJobs()}
          </div>
        </div>
      </div>
    </>
  );
};

export default Jobs;
