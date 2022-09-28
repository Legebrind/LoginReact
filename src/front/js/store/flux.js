const getState = ({ getStore, getActions, setStore }) => {
  return {
    store: {
      token: null,
      user: { email: null, id: null },
      message: null,
      demo: [
        {
          title: "FIRST",
          background: "white",
          initial: "white",
        },
        {
          title: "SECOND",
          background: "white",
          initial: "white",
        },
      ],
    },
    actions: {
      // Use getActions to call a function within a fuction
      exampleFunction: () => {
        getActions().changeColor(0, "green");
      },
      logout: async () => {
        const store = getStore();
        const opts = {
          method: "DELETE",
          headers: {
            Authorization: "Bearer " + store.token,
          },
        };
        try {
          const resp = await fetch(process.env.BACKEND_URL + "/logout", opts);
          const data = await resp.json();
          return data;
        } catch (error) {
          console.error("There has been an error loging out");
        }

        sessionStorage.removeItem("token");
        setStore({ token: null });
        setStore({ user: null });
      },
      synchData: () => {
        setStore({ token: sessionStorage.getItem("token") });
        getData();
      },

      getData: async () => {
        const store = getStore();
        const opts = {
          headers: {
            Authorization: "Bearer " + store.token,
          },
        };
        try {
          const resp = await fetch(
            process.env.BACKEND_URL + "/api/protected",
            opts
          );
          const data = await resp.json();
          setStore({ user: data });
          return data;
        } catch (error) {
          console.error("There has been an error retrieving data");
        }
      },

      login: async (email, password) => {
        const opts = {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: email,
            password: password,
          }),
        };
        try {
          console.log(process.env.BACKEND_URL);
          const resp = await fetch(
            process.env.BACKEND_URL + "/api/token",
            opts
          );
          if (resp.status !== 200) {
            alert("There has been some error");
            return false;
          }
          const data = await resp.json();
          sessionStorage.setItem("token", data.token);
          setStore({ token: data.token });

          return true;
        } catch (error) {
          console.error("There has been an error login in");
        }
      },

      register: async (email, password) => {
        const opts = {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: email,
            password: password,
            is_active: 1,
          }),
        };
        try {
          const resp = await fetch(
            "https://3001-legebrind-loginreact-bjiuld8u54i.ws-eu67.gitpod.io/api/register",
            opts
          );
          if (resp.status !== 200) {
            alert("There has been some error");
            return false;
          }
          const data = await resp.json();
          return data;
        } catch (error) {
          console.error("There has been an error login in");
        }
      },

      getMessage: async () => {
        try {
          // fetching data from the backend
          const resp = await fetch(process.env.BACKEND_URL + "/api/hello");
          const data = await resp.json();
          setStore({ message: data.message });
          // don't forget to return something, that is how the async resolves
          return data;
        } catch (error) {
          console.log("Error loading message from backend", error);
        }
      },
      changeColor: (index, color) => {
        //get the store
        const store = getStore();

        //we have to loop the entire demo array to look for the respective index
        //and change its color
        const demo = store.demo.map((elm, i) => {
          if (i === index) elm.background = color;
          return elm;
        });

        //reset the global store
        setStore({ demo: demo });
      },
    },
  };
};

export default getState;
