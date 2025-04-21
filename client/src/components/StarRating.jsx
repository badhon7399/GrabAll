import { Box } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';

const StarRating = ({ value, max = 5 }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
    {Array.from({ length: max }).map((_, i) =>
      i < Math.round(value) ? (
        <StarIcon key={i} sx={{ color: '#febd69', fontSize: 20 }} />
      ) : (
        <StarBorderIcon key={i} sx={{ color: '#febd69', fontSize: 20 }} />
      )
    )}
  </Box>
);

export default StarRating;
