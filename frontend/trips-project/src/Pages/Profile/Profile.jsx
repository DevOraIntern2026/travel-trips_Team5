import OperatorLayout from '../../Layout/OperatorLayout';
import { useProfile } from '../../hooks/useProfile';
import { profileService } from '../../services/profile';
import SyncBanner from './components/SyncBanner';
import ProfileHeading from './components/ProfileHeading';
import BrandImagery from './components/BrandImagery';
import PersonalInfoForm from './components/PersonalInfoForm';
import LicensesSection from './components/LicensesSection';
import SecurityCard from './components/SecurityCard';
import AlertsCard from './components/AlertsCard';
import RegionalConfig from './components/RegionalConfig';
import DangerZone from './components/DangerZone';
import UnsavedBar from './components/UnsavedBar';
export default function Profile() {
    const { draft, dirty, saving, error, patch, discard, save } = useProfile();
    if (!draft) {
        return <OperatorLayout crumbs={[{ label: 'Operator Workspace', to: '/dashboard' }, { label: 'Profile' }]}><p className="text-sm text-slate-500">{error ?? 'Loading profile…'}</p></OperatorLayout>;
    }
    const upload = async (kind, file) => {
        const { url } = await profileService.uploadImage(kind, file);
        patch(kind === 'portrait' ? { portraitUrl: url } : { sealUrl: url });
    };
    return (<OperatorLayout crumbs={[{ label: 'Operator Workspace', to: '/dashboard' }, { label: 'Profile' }]}>
      <SyncBanner message="Profile & Outfitter credentials successfully synced with EEAA registry."/>
      <ProfileHeading dirty={dirty} saving={saving} onSave={save} onPreview={() => window.open('/outfitter/preview', '_blank')}/>
      {error && <p className="mb-3 rounded-md bg-red-50 px-3 py-2 text-xs text-red-700">{error}</p>}
      <div className="grid gap-5 pb-24 lg:grid-cols-[1fr_320px]">
        <div className="space-y-5">
          <BrandImagery profile={draft} onUpload={upload} onAltChange={(portraitAlt) => patch({ portraitAlt })} onRemove={() => patch({ portraitUrl: undefined })}/>
          <PersonalInfoForm profile={draft} onChange={patch}/>
          <LicensesSection licenses={draft.licenses}/>
        </div>
        <div className="space-y-5">
          <SecurityCard />
          <AlertsCard value={draft.alerts} onChange={(alerts) => patch({ alerts })}/>
          <RegionalConfig profile={draft} onChange={patch}/>
          <DangerZone onPause={() => void profileService.pauseDepartures()} onDeactivate={() => void profileService.requestDeactivation()}/>
        </div>
      </div>
      {dirty && <UnsavedBar onDiscard={discard} onSave={save} saving={saving}/>}
    </OperatorLayout>);
}
