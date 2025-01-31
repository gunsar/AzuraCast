import {useAxios} from "~/vendor/axios";
import {useSweetAlert} from "~/vendor/sweetalert";
import {useTranslate} from "~/vendor/gettext";
import {getStationApiUrl} from "~/router.ts";
import {useRouter} from "vue-router";
import {set} from "lodash";
import {useNotify} from "~/functions/useNotify";

export default function useToggleFeature(feature, newValue) {
    const {axios} = useAxios();
    const {confirmDelete} = useSweetAlert();
    const {wrapWithLoading, notifySuccess} = useNotify();
    const {$gettext} = useTranslate();
    const router = useRouter();

    const profileEditUrl = getStationApiUrl('/profile/edit');

    return () => {
        confirmDelete({
            title: (newValue) ? $gettext('Enable?')
                : $gettext('Disable?')
        }).then((result) => {
            if (result.value) {
                const remoteData = {};
                set(remoteData, feature, newValue);

                wrapWithLoading(
                    axios.put(
                        profileEditUrl.value,
                        remoteData
                    )
                ).then((resp) => {
                    notifySuccess(resp.data.message);
                    router.go(0);
                });
            }
        });
    };
}
