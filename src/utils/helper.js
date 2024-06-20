import toast from "react-hot-toast";

export const showToast = () => {
  toast.promise(
    myPromise,
    {
      loading: "Loading",
      success: (data) => `Successfully saved ${data.name}`,
      error: (err) => `This just happened: ${err.toString()}`,
    },
    {
      style: {
        padding: "8px ",
        minWidth: "250px",
        fontSize: "13.5px",
        borderRadius: "5px",
      },
      success: {
        duration: 5000,
        icon: "🔥",
      },
    }
  );
};
