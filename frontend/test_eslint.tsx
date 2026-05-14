import React, { useState, useEffect, useCallback } from "react";

const Test = () => {
  const [data, setData] = useState(null);
  
  const fetchScreens = useCallback(async () => {
    setData("test");
  }, []);

  useEffect(() => {
    const loadData = async () => {
      await fetchScreens();
    };
    loadData();
  }, [fetchScreens]);

  return <div>{data}</div>;
};
