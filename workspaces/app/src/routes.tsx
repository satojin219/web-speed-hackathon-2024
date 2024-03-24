import React, { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import { styled } from 'styled-components';

import { SvgIcon } from './features/icons/components/SvgIcon';
import { Link } from './foundation/components/Link';
import { Text } from './foundation/components/Text';
import { ActionLayout } from './foundation/layouts/ActionLayout';
import { CommonLayout } from './foundation/layouts/CommonLayout';
import { Color, Space, Typography } from './foundation/styles/variables';

const AuthorDetailPage = lazy(() => import('./pages/AuthorDetailPage/index'));
const BookDetailPage = lazy(() => import('./pages/BookDetailPage/index'));
const EpisodeDetailPage = lazy(() => import('./pages/EpisodeDetailPage/index'));
const SearchPage = lazy(() => import('./pages/SearchPage/index'));
const TopPage = lazy(() => import('./pages/TopPage/index'));

const _BackToTopButton = styled(Link)`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: ${Space * 1}px;
  border: none;
  background-color: transparent;
`;

export const Router: React.FC = () => {
  return (
    <Routes>
      <Route element={<CommonLayout />} path={'/'}>
        <Route element={<TopPage />} path={''} />
      </Route>
      <Route
        element={
          <ActionLayout
            leftContent={
              <_BackToTopButton to={'/'}>
                <SvgIcon color={Color.MONO_100} height={32} type="ArrowBack" width={32} />
                <Text color={Color.MONO_100} typography={Typography.NORMAL16} weight="bold">
                  トップへ戻る
                </Text>
              </_BackToTopButton>
            }
          />
        }
        path={'/'}
      >
        <Route element={<BookDetailPage />} path={'books/:bookId'} />
        <Route element={<EpisodeDetailPage />} path={'books/:bookId/episodes/:episodeId'} />
        <Route element={<AuthorDetailPage />} path={'authors/:authorId'} />
        <Route element={<SearchPage />} path={'search'} />
      </Route>
    </Routes>
  );
};
