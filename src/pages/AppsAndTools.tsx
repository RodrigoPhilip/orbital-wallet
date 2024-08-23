import styled from 'styled-components';
import externalLink from '../assets/external-link.svg';
import { Text } from '../components/Reusable';
import { Show } from '../components/Show';
import { useTheme } from '../hooks/useTheme';
import { ColorThemeProps } from '../theme';
import { featuredApps } from '../utils/constants';
import { TopNav } from '../components/TopNav';

const Content = styled.div`
  width: 100vw;
  height: 100vh;
`;

const ScrollableContainer = styled.div`
  position: absolute;
  top: 4.25rem;
  bottom: 3.75rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-y: auto;
  overflow-x: hidden;
  width: 100%;
  align-items: stretch;
`;

const DiscoverAppsRow = styled.div<ColorThemeProps>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: ${({ theme }) => theme.darkAccent};
  border-radius: 0.5rem;
  padding: 0.5rem;
  margin: 0.25rem 5% 0.25rem 5%;
  cursor: pointer;
`;

const ImageAndDomain = styled.div`
  display: flex;
  align-items: center;
`;

const AppIcon = styled.img`
  width: 3rem;
  height: 3rem;
  margin-right: 1rem;
  border-radius: 0.5rem;
`;

const DiscoverAppsText = styled(Text)<ColorThemeProps>`
  color: ${({ theme }) => theme.white};
  margin: 0;
  font-weight: 600;
  text-align: left;
`;

const ExternalLinkIcon = styled.img`
  width: 1.25rem;
  height: 1.25rem;
  cursor: pointer;
`;

const apps = featuredApps as { name: string; link: string; icon: string }[];

const NoAppsContainer = styled.div`
  position: absolute;
  width: 100vw;
  top: 4.25rem;
  bottom: 3.75rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const NoApps = () => {
  const { theme } = useTheme();
  return (
    <NoAppsContainer>
      <Text
        theme={theme}
        style={{
          fontSize: '1rem',
        }}
      >
        No apps yet
      </Text>
    </NoAppsContainer>
  );
};

export const AppsAndTools = () => {
  const { theme } = useTheme();

  const discoverAppsPage = (
    <Show when={apps.length > 0} whenFalseContent={<NoApps />}>
      <ScrollableContainer>
        {apps.map((app, idx) => {
          return (
            <DiscoverAppsRow key={app.name + idx} theme={theme} onClick={() => window.open(app.link, '_blank')}>
              <ImageAndDomain>
                <AppIcon src={app.icon} />
                <DiscoverAppsText theme={theme}>{app.name}</DiscoverAppsText>
              </ImageAndDomain>
              <ExternalLinkIcon src={externalLink} />
            </DiscoverAppsRow>
          );
        })}
      </ScrollableContainer>
    </Show>
  );

  return (
    <Content>
      <TopNav />
      {discoverAppsPage}
    </Content>
  );
};
