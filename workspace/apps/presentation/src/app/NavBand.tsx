import { Box, Button, Divider } from '@mui/material';
import { FC, PropsWithChildren, memo } from 'react';
import { useNavigate } from 'react-router-dom';

export interface IPage {
  to: string;
  label: string;
  sub?: IPage[];
}
interface INavBandProps {
  pages?: IPage[];
}
export const NavBand: FC<PropsWithChildren<INavBandProps>> = memo(
  ({ pages, children }) => {
    const navigate = useNavigate();
    return !pages?.length ? null : (
      <>
        <Box sx={{ flexGrow: 1, display: 'flex', overflow: 'auto' }}>
          {pages?.map((page, index) => (
            <Button
              key={index}
              sx={{ my: 2, color: 'white', display: 'block' }}
              style={{ minWidth: 'unset' }}
              onClick={() => navigate(page.to)}
            >
              {page.label}
            </Button>
          ))}
        </Box>
        <Divider sx={{ marginBottom: 3 }} />
        <Box
          sx={{
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            margin: 2,
          }}
        >
          {children}
        </Box>
      </>
    );
  }
);
