import React, { useState, useEffect, useContext } from 'react';
import {
  Header, AppWrapper, Loading, Item,
} from 'components';
import { getTitles } from 'api/titles';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useRouter } from 'next/router';
import AppContext from 'context/AppContext';
import { useNotification } from 'hooks';

const Company = () => {
  const { data: { userSession, userData } } = useContext(AppContext);
  const { query: { id } } = useRouter();
  const [page, setPage] = useState(1);
  const [data, setData] = useState([]);
  const [prevId, setPrevId] = useState(id);
  const [isLoading, setIsLoading] = useState(true);
  const showError = useNotification('An error ocurred when getting latest titles', 'error');
  const [noMoreResults, setNoMoreResults] = useState(false);

  const getData = async (language) => {
    try {
      if (id === prevId) {
        const { results } = await getTitles({ language, withCompanies: id, page });
        if (results.length > 0) {
          setData(data.concat(results));
          setPage(page + 1);
        } else {
          setNoMoreResults(true);
        }
      } else {
        const { results } = await getTitles({ language, withCompanies: id, page: 1 });
        setData(results);
        setPage(page + 1);
        setPrevId(id);
      }
    } catch (err) {
      showError();
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (userSession !== undefined && userData !== undefined) {
      if (!noMoreResults && (id !== prevId || data.length < 80)) {
        getData(userData.language);
      }
    }
  }, [userSession, userData, userData?.language, id, page]);

  if (isLoading) {
    return (
      <Loading />
    );
  }

  return (
    <div>
      <Header />
      <AppWrapper>
        <div className="mt-24">
          <InfiniteScroll
            dataLength={data.length}
            next={getData}
            hasMore
            className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 2xl:grid-cols-10 gap-2 xl:gap-4 place-items-center overflow-x-hidden"
            style={{ overflowX: 'hidden' }}
          >
            {data.map((title) => (
              <Item item={title} index={0} key={`title-id-${title.id}`} isOnList />
            ))}
          </InfiniteScroll>
        </div>
      </AppWrapper>
    </div>
  );
};

export default Company;
