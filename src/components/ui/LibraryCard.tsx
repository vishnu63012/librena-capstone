
import React from 'react';
import { Check, Star, ArrowUpRight, Calendar, Heart } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Library } from '@/lib/type';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { Timestamp } from 'firebase/firestore';

function formatDate(date: string | Timestamp | undefined): string {
  try {
    if (!date) return "N/A";
    if (typeof date === "string") return new Date(date).toLocaleDateString();
    if ("toDate" in date) return date.toDate().toLocaleDateString();
    return "N/A";
  } catch {
    return "N/A";
  }
}

interface LibraryCardProps {
  library: Library;
  isSelected: boolean;
  isFavorite?: boolean;
  onSelect: (library: Library) => void;
  onToggleFavorite?: (library: Library) => void;
  viewOnly?: boolean;
  context?: 'home' | 'add' | 'view';
}

export const LibraryCard: React.FC<LibraryCardProps> = ({
  library,
  isSelected,
  isFavorite,
  onSelect,
  onToggleFavorite,
  viewOnly = false,
  context = 'home',
}) => {
  const { toast } = useToast();
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const osList = Array.isArray(library.os)
    ? library.os
    : typeof library.os === 'string'
    ? [library.os]
    : [];

  const tagsList = Array.isArray(library.tags)
    ? library.tags
    : typeof library.tags === 'string'
    ? [library.tags]
    : [];

  const getDetailsPath = () => {
    if (context === 'add') return `/library/add/${library.id}?projectId=${projectId}`;
    if (context === 'view') return `/library/view/${library.id}`;
    return `/library/home/${library.id}`;
  };

  return (
    <Card className={`overflow-hidden transition-all duration-300 h-full ${isSelected ? 'ring-2 ring-theme-hover shadow-lg' : 'hover:shadow-md'}`}>
      <CardHeader className="p-4 pb-0 flex justify-between">
        <div className="flex items-start justify-between w-full">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-lg text-blue-700 dark:text-blue-300">{library.name}</h3>
              <Badge variant="outline" className="text-xs">v{library.version}</Badge>
            </div>
            <div className="flex items-center text-muted-foreground text-sm mt-1">
              {library.last_updated && (
                <>
                  <Calendar className="h-3 w-3 mr-1" />
                  <span>Updated on {formatDate(library.last_updated)}</span>
                  <span className="mx-2">•</span>
                </>
              )}
              {library.stars !== undefined && (
                <>
                  <Star className="h-3 w-3 mr-1 text-yellow-500" />
                  <span>{library.stars}</span>
                </>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2 items-end">
            {isAuthenticated && (
              <Checkbox
                checked={isSelected}
                onCheckedChange={() => onSelect(library)}
                className="h-5 w-5"
                disabled={viewOnly}
              />
            )}
            {isAuthenticated && onToggleFavorite && (
              <button
                onClick={() => onToggleFavorite(library)}
                title="Favorite"
                className={`text-red-500 hover:text-red-600 transition-colors ${isFavorite ? 'opacity-100' : 'opacity-50'}`}
              >
                <Heart fill={isFavorite ? 'currentColor' : 'none'} className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4">
        <p className="text-muted-foreground text-sm line-clamp-3 mb-3">{library.description || 'No description available.'}</p>

        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
          <div><span className="text-muted-foreground">Category:</span> <span className="ml-1 font-medium">{library.category || 'N/A'}</span></div>
          <div><span className="text-muted-foreground">License:</span> <span className="ml-1 font-medium">{library.license || 'N/A'}</span></div>
          <div><span className="text-muted-foreground">Cost:</span> <span className="ml-1 font-medium">{library.cost || 'N/A'}</span></div>
          <div><span className="text-muted-foreground">Size:</span> <span className="ml-1 font-medium">{library.size || 'N/A'}</span></div>
        </div>

        <div className="mt-3">
          <div className="text-sm text-muted-foreground mb-1">Compatible with:</div>
          <div className="flex flex-wrap gap-1">
            {osList.length
              ? osList.map((os) => (
                  <Badge key={os} variant="secondary" className="text-xs">{os}</Badge>
                ))
              : <span className="text-xs text-muted-foreground">N/A</span>}
          </div>
        </div>

        <div className="mt-3">
          <div className="flex flex-wrap gap-1">
            {tagsList.length
              ? tagsList.map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="text-xs bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300"
                  >
                    {tag}
                  </Badge>
                ))
              : <span className="text-xs text-muted-foreground">No tags</span>}
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button
          variant="ghost"
          className="text-sm w-full justify-center"
          onClick={() => {
            if (!isAuthenticated) {
              toast({
                title: "Login Required",
                description: "Please login to view library details.",
                variant: "destructive",
              });
              setTimeout(() => {
                navigate("/login");
              }, 1500);
            } else {
              navigate(getDetailsPath());
            }
          }}
        >
          View Details
          <ArrowUpRight className="ml-1 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};
