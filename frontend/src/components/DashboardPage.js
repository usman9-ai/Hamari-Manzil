import useFetch from '../hooks/useFetch';
import HostelGrid from './HostelGrid';
import BookingForm from './BookingForm';

export default function DashboardPage() {
  const { data: user, loading: lu, error: eu } = useFetch('/api/users/me');
  const { data: bookings, loading: lb, error: eb, refetch } = useFetch('/api/bookings');
  const { data: hostels, loading: lh, error: eh } = useFetch('/api/hostels');

  return (
    <div className="container page-safe px-3 py-3">
      <div className="mb-3">
        <div className="h1 mb-1">Find Your Perfect Stay</div>
        <div className="small">Discover top hostels and exclusive deals tailored for students.</div>
      </div>

      <div className="row grid-gap-16">
        <div className="col-12 col-lg-8">
          <div className="card-dashboard mb-3">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <div className="h2 mb-1">Welcome{lu?'...': user ? `, ${user.name}` : ''}</div>
                <div className="small">Quick actions</div>
              </div>
              <button className="btn-outline-fg">Explore Deals</button>
            </div>
            <div className="row mt-3">
              <div className="col-6 col-md-3 mb-2">
                <div className="card-dashboard">
                  <div className="meta mb-1">Active Bookings</div>
                  <div className="h2">{lb?'—':(bookings?.length||0)}</div>
                </div>
              </div>
              <div className="col-6 col-md-3 mb-2">
                <div className="card-dashboard">
                  <div className="meta mb-1">Favorites</div>
                  <div className="h2">{user?.favorites?.length||0}</div>
                </div>
              </div>
              <div className="col-6 col-md-3 mb-2">
                <div className="card-dashboard">
                  <div className="meta mb-1">Payments</div>
                  <div className="h2">$ {(user?.paymentsTotal||0).toLocaleString()}</div>
                </div>
              </div>
              <div className="col-6 col-md-3 mb-2">
                <div className="card-dashboard">
                  <div className="meta mb-1">Messages</div>
                  <div className="h2">{user?.unread||0}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-3">
            <div className="h2 mb-2">Featured Destinations</div>
            {lh && <div className="small">Loading...</div>}
            {eh && <div className="help-error">{eh}</div>}
            {hostels && <HostelGrid hostels={hostels} />}
          </div>
        </div>

        <div className="col-12 col-lg-4">
          <BookingForm onSuccess={refetch} />
        </div>
      </div>
    </div>
  );
}